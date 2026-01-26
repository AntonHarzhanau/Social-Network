<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\Chat\Application\DTO\ChatListItemDTO;
use App\Modules\Chat\Application\DTO\ChatListItemRowDTO;
use App\Modules\Chat\Application\DTO\ChatMessagePreviewDTO;
use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\Media\Api\MediaApiInterface;
use Symfony\Component\Uid\Uuid;

final class ChatListAssembler
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {
    }

    /** @param ChatListItemRowDTO[] $rows @return ChatListItemDTO[] */
    public function assemble(?Uuid $currentUserId, array $rows): array
    {
        if (!$rows)
            return [];

        // 1) Собираем нужные userIds
        $userIds = [];

        foreach ($rows as $r) {
            if ($r->lastSenderId)
                $userIds[] = $r->lastSenderId;
            if ($r->directOtherUserId)
                $userIds[] = $r->directOtherUserId;
        }

        $userIds = array_values(array_unique($userIds));
        // 2) Тянем превью пользователей (username + avatarUrl уже внутри)
        $userPreviews = $userIds ? $this->userDirectory->getPreviewsByIds($userIds) : [];
        $usersById = [];
        foreach ($userPreviews as $u) {
            $usersById[$u->id] = $u;
        }

        $chatIds = array_map(fn(ChatListItemRowDTO $chat) => $chat->chatId, $rows);
        $unreadCounts = $this->messageRepository->getUnreadMessageCountForUserByChats($currentUserId, $chatIds);

        $out = [];

        foreach ($rows as $r) {
            $otherUser = $r->directOtherUserId ? ($usersById[$r->directOtherUserId] ?? null) : null;
            $sender = $r->lastSenderId ? ($usersById[$r->lastSenderId] ?? null) : null;

            $lastMessage = null;
            if ($r->lastMessageId && $r->lastMessageCreatedAt) {
                $lastMessage = new ChatMessagePreviewDTO(
                    $r->lastMessageId,
                    $r->lastMessageContent,
                    $r->lastMessageCreatedAt->format(DATE_ATOM),
                    $sender
                );
            }
            $displayAvatarUrl = null;
            $title = null;
            if ($r->type->value === 'direct') {
                $displayAvatarUrl = $otherUser?->avatarUrl;
                $title = $otherUser?->name;
            } else if ($r->type->value === 'group') {
                $displayAvatarUrl = $r->avatarUrl;
                $title = $r->title;
            } else {
                $displayAvatarUrl = null;
                $title = 'Personal Chat';
            }

            $out[] = new ChatListItemDTO(
                $r->chatId,
                $r->type->value,
                $title,
                $displayAvatarUrl,
                $r->createdAt->format(DATE_ATOM),
                $r->updatedAt ? $r->updatedAt->format(DATE_ATOM) : null,
                $r->lastReadMessageId,
                $r->lastReadAt ? $r->lastReadAt->format(DATE_ATOM) : null,
                $lastMessage,
                $unreadCounts[$r->chatId] ?? 0,
                $r->lastReadMessageByOther,
                $r->lastReadAtByOther ? $r->lastReadAtByOther->format(DATE_ATOM) : null,
            );
        }

        return $out;
    }
}
