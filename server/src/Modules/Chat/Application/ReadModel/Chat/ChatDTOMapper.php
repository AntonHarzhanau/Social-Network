<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

class ChatDTOMapper
{
    public function __construct(
        private readonly MediaApiInterface $mediaApi,
    ) {
    }

    public function toChatResponseDTO(Chat $chat, Uuid $currentUserId, ?int $unreadMessageCount = null): array
    {
        
        $currentParticipant = $this->getCurrentParticipant($chat, $currentUserId);
        $lastMessageEntity = $chat->getLastMessage();


        $lastMessage = $lastMessageEntity ? new MessageResponseDTO(
            id: $lastMessageEntity->getId()->toRfc4122(),
            content: $lastMessageEntity->getContent(),
            sender: [
                'id' => $lastMessageEntity->getSender()->getId()->toRfc4122(),
                'name' => $lastMessageEntity->getSender()->getUsername(),
                'avatarUrl' => $this->getAvatarUrl($lastMessageEntity->getSender()),
            ],
            createdAt: $lastMessageEntity->getCreatedAt()->format(DATE_ATOM),
        ) : null;

        $title = $this->resolveChatTitle($chat, $currentUserId);
        $avatarUrl = $this->resolveChatAvatarUrl($chat, $currentUserId);

        $chatResponse = [
            'id' => $chat->getId()->toRfc4122(),
            'type' => $chat->getType()->value,
            'title' => $title,
            'avatarUrl' => $avatarUrl,
            'lastMessage' => $lastMessage,
            'createdAt' => $chat->getCreatedAt()->format(DATE_ATOM),
            'lastMessageAt' => $lastMessage?->createdAt,
            'unreadMessageCount' => $unreadMessageCount,
            'lastReadMessageId' => $currentParticipant?->getLastReadMessage()?->getId()?->toRfc4122(),
            'lastReadAt' => $currentParticipant?->getLastReadAt()?->format(DATE_ATOM),

        ];
        return $chatResponse;
    }

    private function getCurrentParticipant(Chat $chat, Uuid $currentUserId): ?ChatParticipant
    {
        foreach ($chat->getChatParticipants() as $participant) {
            $user = $participant->getUser();
            if ($user->getId()->toRfc4122() === $currentUserId->toRfc4122()) {
                return $participant;
            }
        }
        return null;
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
            if ($user->getId()->toRfc4122() !== $currentUserId->toRfc4122()) {
                return $user;
            }
        }
        return null;
    }

    private function resolveChatAvatarUrl(Chat $chat, Uuid $currentUserId): ?string
    {
        return match ($chat->getType()) {
            ChatTypeEnum::SELF => null, //TODO: set saved avatar url
            ChatTypeEnum::DIRECT => $this->getAvatarUrl($this->getOtherParticipant($chat, $currentUserId)),
            ChatTypeEnum::GROUP => $chat->getAvatarUrl() ?: null,
            default => $chat->getAvatarUrl(),
        };
    }

    private function getAvatarUrl(?User $user): ?string
    {
        if ($user === null) {
            return null;
        }

        $avatarId = $user->getCurrentAvatar()?->getPreview()->getId() ?? null;
        $media = $this->mediaApi->getMediasByIds(null, [$avatarId]);

        $url = $avatarId ? $media[$avatarId->toRfc4122()]->url : null;

        return $url;
    }
}
