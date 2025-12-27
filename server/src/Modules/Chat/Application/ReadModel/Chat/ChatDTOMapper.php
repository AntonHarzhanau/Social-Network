<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

class ChatDTOMapper
{
    public function __construct() {}

    public function toChatResponseDTO(Chat $chat, Uuid $currentUserId, ?int $unreadMessageCount = null): array
    {
        $lastMessage = null;
        $lastMessageEntity = $chat->getLastMessage();
        if ($lastMessageEntity) {
            $lastMessage = [
                'id' => $lastMessageEntity->getId(),
                'sender' => $lastMessageEntity->getSender()->getId(),
                'content' => $lastMessageEntity->getContent(),
                'createdAt' => $lastMessageEntity->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        $title = $this->resolveChatTitle($chat, $currentUserId);
        $avatarUrl = $this->resolveChatAvatarUrl($chat, $currentUserId);

        return [
            'id' => $chat->getId(),
            'type' => $chat->getType()->value,
            'title' => $title,
            'avatarUrl' => $avatarUrl,
            'lastMessage' => $lastMessage,
            'createdAt' => $chat->getCreatedAt() ? $chat->getCreatedAt()->format('Y-m-d H:i:s') : null,
            'updatedAt' => $chat->getUpdatedAt() ? $chat->getUpdatedAt()->format('Y-m-d H:i:s') : null,
            'lastMessageAt' => $chat->getLastMessage() ? $chat->getLastMessage()->getCreatedAt()->format('Y-m-d H:i:s') : null,
            'unreadMessageCount' => $unreadMessageCount,
        ];

    }

    private function resolveChatTitle(Chat $chat, Uuid $currentUserId): ?string
    {
        return match ($chat->getType()) {
            ChatTypeEnum::SELF => 'Saved Messages',
            ChatTypeEnum::DIRECT => $this->resolveDirectChatTitle($chat, $currentUserId),
            ChatTypeEnum::GROUP => $chat->getTitle() ?? 'Unnamed Group',
            default => $chat->getTitle() ?? 'Chat',
        };
    }

    private function resolveDirectChatTitle(Chat $chat, Uuid $currentUserId): ?string
    {
        $otherParticipant = $this->getOtherParticipant($chat, $currentUserId);
        return $otherParticipant ? $otherParticipant->getUsername() : 'Direct Chat';
    }

    private function getOtherParticipant(Chat $chat, Uuid $currentUserId): ?User
    {
        // dd($chat->getChatParticipants()->toArray());
        foreach ($chat->getChatParticipants() as $paticipant) {
            $user = $paticipant->getUser();
            if ($user->getId() !== $currentUserId) {
                return $user;
            }
        }
        return null;
    }

    private function resolveChatAvatarUrl(Chat $chat, Uuid $currentUserId): ?string
    {
        return match ($chat->getType()) {
            ChatTypeEnum::SELF => null, //TODO: set saved avatar url
            ChatTypeEnum::DIRECT => $this->getOtherParticipant($chat, $currentUserId)?->getAvatarUrl(),
            ChatTypeEnum::GROUP => $chat->getAvatarUrl() ?: null,
            default => $chat->getAvatarUrl(),
        };
    }
}
