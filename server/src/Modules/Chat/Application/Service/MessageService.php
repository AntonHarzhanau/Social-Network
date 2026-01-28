<?php

namespace App\Modules\Chat\Application\Service;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
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
    ) {
    }

    public function createMessage(Uuid $chatId, Uuid $senderId, string $content): Message
    {
        $user = $this->userDirectory->findById($senderId);
        $chat = $this->chatRepository->findById($chatId);

        if (!$user)
            throw new \InvalidArgumentException('User not found.');
        if (!$chat)
            throw new \InvalidArgumentException('Chat not found.');

        $senderParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $senderId,
        ]);

        if (!$senderParticipant) {
            throw new \LogicException('User is not a participant of the chat.');
        }

        if ($chat->getType() === ChatTypeEnum::GROUP && $senderParticipant->getDeletedAt() !== null) {
            throw new \LogicException('User was removed from the group chat.');
        }

        if ($chat->getType() === ChatTypeEnum::DIRECT) {
            $participants = $this->chatParticipantRepository->findBy(['chat' => $chatId]);
            foreach ($participants as $p) {
                if ($p->getDeletedAt() !== null) {
                    $p->setDeletedAt(null);
                    $this->chatParticipantRepository->save($p);
                }
            }
        }

        $message = new Message();
        $message->setSender($user);
        $message->setContent($content);
        $chat->addMessage($message);
        $chat->setLastMessage($message);

        $this->messageRepository->save($message);
        $this->chatRepository->save($chat);

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
            $newLastMessage = $this->messageRepository->findOneBy(
                ['chat' => $chat->getId()],
                ['createdAt' => 'DESC'],
                1,
                1
            );
            $chat->setLastMessage($newLastMessage ?? null);
            $this->chatRepository->save($chat);
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
