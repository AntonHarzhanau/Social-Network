<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\Chat\Domain\Entity\Message;
use Symfony\Component\Uid\Uuid;


final class MarkChatReadAction
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {
    }

    public function execute(
        Uuid $chatId,
        Uuid $userId,
        ?Uuid $lastReadMessageId = null
    ): void {
        if ($lastReadMessageId === null) {
            return;
        }

        $participant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]);

        if ($participant === null) {
            throw new \RuntimeException('Chat participant not found');
        }

        /** @var Message|null */
        $message = $this->messageRepository->findOneBy([
            'id' => $lastReadMessageId,
            'chat' => $chatId,
        ]);

        if (!$message) {
            throw new \RuntimeException('Message not found in chat');
        }

        $lastReadMessage = $participant->getLastReadMessage();

        // dd($participant, $message, $lastReadMessage);
        if ($lastReadMessage === null || $message->getCreatedAt() > $lastReadMessage->getCreatedAt()) {
            $participant->setLastReadMessage($message);
            $participant->setLastReadAt($message->getCreatedAt());
            $this->chatParticipantRepository->save($participant);
        }

    }
}
