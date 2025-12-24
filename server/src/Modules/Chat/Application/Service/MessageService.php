<?php

namespace App\Modules\Chat\Application\Service;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Event\MessageCreated;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\Shared\Application\Port\EventBusInterface;
use Symfony\Component\Uid\Uuid;

class MessageService
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly UserDirectoryInterface $userDirectory,
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly EventBusInterface $eventBus,
    ) {}

    public function createMessage(Uuid $chatId, Uuid $senderId, string $content): Message
    {
        $user = $this->userDirectory->findById($senderId);
        $chat = $this->chatRepository->findById($chatId);

        $chatParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $senderId,
        ]);

        if ($chat === null) {
            throw new \InvalidArgumentException('Chat not found.');
        }

        if (!$chatParticipant) {
            throw new \InvalidArgumentException('User is not a participant of the chat.');
        }

        $message = new Message();
        $message->setSender($user);
        $message->setContent($content);
        $chat->addMessage($message);
        $chat->setLastMessage($message);

        $this->messageRepository->save($message);
        $this->chatRepository->save($chat);

        $sender = $message->getSender();

        $payload = [
            'id' => (string) $message->getId(),
            'chatId' => (string) $chat->getId(),
            'sender' => [
                'id' => (string) $sender->getId(),
                'username' => $sender->getUsername(),
                'avatarUrl' => $sender->getAvatarUrl(),
            ],
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format(\DateTime::ATOM),
        ];

        $this->eventBus->dispatch(
            new MessageCreated(
                chatId: (string) $chat->getId(),
                message: $payload
            )
        );



        return $message;
    }
}
