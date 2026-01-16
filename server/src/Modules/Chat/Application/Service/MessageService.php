<?php

namespace App\Modules\Chat\Application\Service;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Event\MessageCreated;
use App\Modules\Chat\Domain\Event\MessageDeleted;
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

        // $sender = $message->getSender();
        $sender = $this->userDirectory->getPreviewsByIds([$senderId])[$senderId->toRfc4122()];

        $payload = [
            'id' => (string) $message->getId(),
            'chatId' => (string) $chat->getId(),
            'sender' => [
                'id' => (string) $sender->id,
                'name' => $sender->name,
                'avatarUrl' => $sender->avatarUrl,
                'slug' => $sender->slug,
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

    public function deleteMessage(Message $message): void
    {
        $chat = $message->getChat();
        $messageId = $message->getId();

        $lastMessage = $chat->getLastMessage();
        if ($message === $lastMessage) {
            $newLastMessage = $this->messageRepository->findBy(
                ['chat' => $chat->getId()],
                ['createdAt' => 'DESC'],
                1,
                1
            );
            $chat->setLastMessage($newLastMessage[0] ?? null);
        }
        $this->messageRepository->delete($message);
        
        $this->eventBus->dispatch(
            new MessageDeleted(
                chatId: (string) $chat->getId(),
                messageId: (string) $messageId
            )
        );
    }
}
