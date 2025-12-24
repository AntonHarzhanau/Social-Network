<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\DTO\Chat\ChatResponseDTO;
use App\DTO\Message\MessageResponseDTO;
use App\DTO\User\UserResponseDTO;
use App\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\User\Domain\Entity\User;

class ChatFactory
{
    public function __construct() {}

    public function toChatResponseDTO(Chat $chat, User $currentUser, ?int $unreadMessageCount = null): ChatResponseDTO
    {   $lastMessage = null;
        $lastMessageEntity = $chat->getLastMessage();
            $lastMessage = $lastMessageEntity
                ? new MessageResponseDTO(
                    id: $lastMessageEntity->getId(),
                    sender: new UserResponseDTO(
                        id: $chat->getLastMessage()->getSender()->getId(),
                        username: $chat->getLastMessage()->getSender()->getUsername(),
                        avatarUrl: $chat->getLastMessage()->getSender()->getAvatarUrl(),
                    ),
                    content: $chat->getLastMessage()->getContent(),
                    createdAt: $chat->getLastMessage()->getCreatedAt()->format('Y-m-d H:i:s'),
                ) : null;


        $title = $this->resolveChatTitle($chat, $currentUser);
        $avatarUrl = $this->resolveChatAvatarUrl($chat, $currentUser);

        return new ChatResponseDTO(
            id: $chat->getId(),
            type: $chat->getType()->value,
            title: $title,
            avatarUrl: $avatarUrl,
            lastMessage: $lastMessage,
            createdAt: $chat->getCreatedAt() ? $chat->getCreatedAt()->format('Y-m-d H:i:s') : null,
            updatedAt: $chat->getUpdatedAt() ? $chat->getUpdatedAt()->format('Y-m-d H:i:s') : null,
            lastMessageAt: $chat->getLastMessage() ? $chat->getLastMessage()->getCreatedAt()->format('Y-m-d H:i:s'): null,
            unreadMessageCount: $unreadMessageCount,
        );
    }

    private function resolveChatTitle(Chat $chat, User $currentUser): ?string
    {
        return match ($chat->getType()) {
            ChatTypeEnum::SELF => 'Saved Messages',
            ChatTypeEnum::DIRECT => $this->resolveDirectChatTitle($chat, $currentUser),
            ChatTypeEnum::GROUP => $chat->getTitle() ?? 'Unnamed Group',
            default => $chat->getTitle() ?? 'Chat',
        };
    }

    private function resolveDirectChatTitle(Chat $chat, User $currentUser): ?string
    {
        $otherParticipant = $this->getOtherParticipant($chat, $currentUser);
        return $otherParticipant ? $otherParticipant->getUsername() : 'Direct Chat';
    }

    private function getOtherParticipant(Chat $chat, User $currentUser): ?User
    {
        // dd($chat->getChatParticipants()->toArray());
        foreach ($chat->getChatParticipants() as $paticipant) {
            $user = $paticipant->getUser();
            if ($user->getId() !== $currentUser->getId()) {
                return $user;
            }
        }
        return null;
    }

    private function resolveChatAvatarUrl(Chat $chat, User $currentUser): ?string
    {
        return match ($chat->getType()) {
            ChatTypeEnum::SELF => null, //TODO: set saved avatar url
            ChatTypeEnum::DIRECT => $this->getOtherParticipant($chat, $currentUser)?->getAvatarUrl(),
            ChatTypeEnum::GROUP => $chat->getAvatarUrl() ?: null,
            default => $chat->getAvatarUrl(),
        };
    }
}
