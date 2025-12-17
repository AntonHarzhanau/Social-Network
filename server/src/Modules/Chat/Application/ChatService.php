<?php

namespace App\Modules\Chat\Application;

use App\DTO\Message\MessageResponseDTO;
use App\DTO\User\UserResponseDTO;
use App\Factory\Chat\ChatFactory;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class ChatService
{
    public function __construct(
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly ChatFactory $chatFactory,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function getChatList(User $currentUser, int $page = 1, int $limit = 20): array
    {
        $chats = $this->chatRepository->findUserChatsWithLastMessage($currentUser, $page, $limit);
        $items = [];

        foreach ($chats as $chat) {
            $items[] = $this->chatFactory->toChatResponseDTO($chat, $currentUser);
        }

        return $items;
    }

    public function getMessagesByChat(Chat $chat, User $currentUser, int $page = 1, int $limit = 30): array
    {
        if ($this->chatParticipantRepository->findOneBy([
            'chat' => $chat,
            'user' => $currentUser,
        ]) === null) {
            throw new AccessDeniedException('You are not a participant of this chat.');
        }

        $data = $this->messageRepository->findBy([
            'chat' => $chat,
        ],
        [
            'createdAt' => 'DESC',
        ], $limit, ($page - 1) * $limit);

        $messages = [];
        foreach ($data as $message) {
            $messages[] = new MessageResponseDTO(
                id: $message->getId(),
                content: $message->getContent(),
                sender: new UserResponseDTO(
                    id: $message->getSender()->getId(),
                    username: $message->getSender()->getUsername(),
                    avatarUrl: $message->getSender()->getAvatarUrl(),
                ),
                createdAt: $message->getCreatedAt()->format(DATE_ATOM),
            );
        }

        return $messages;
    }

    public function saveChat(Chat $chat): void
    {
        $this->chatRepository->save($chat);
    }

}
