<?php

namespace App\Service;

use App\DTO\Message\MessageResponseDTO;
use App\DTO\User\UserResponseDTO;
use App\Entity\Chat;
use App\Entity\User;
use App\Factory\Chat\ChatFactory;
use App\Repository\ChatParticipantRepository;
use App\Repository\ChatRepository;
use App\Repository\MessageRepository;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class ChatService
{
    public function __construct(
        private readonly ChatRepository $chatRepository,
        private readonly ChatFactory $chatFactory,
        private readonly ChatParticipantRepository $chatParticipantRepository,
        private readonly MessageRepository $messageRepository,
    ) {}

    public function getChatListForUser(User $currentUser): array
    {
        $chats = $this->chatRepository->findUserChatsWithLastMessage($currentUser);
        $items = [];

        foreach ($chats as $chat) {
            $items[] = $this->chatFactory->toChatResponseDTO($chat, $currentUser);
        }

        return $items;
    }

    public function getMessagesByChat(Chat $chat, User $currentUser): array
    {
        if ($this->chatParticipantRepository->findOneBy([
            'chat' => $chat,
            'user' => $currentUser,
        ]) === null) {
            throw new AccessDeniedException('You are not a participant of this chat.');
        }

        $data = $this->messageRepository->findBy([
            'chat' => $chat,
        ]);

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
}
