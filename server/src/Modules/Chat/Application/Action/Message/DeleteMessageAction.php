<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteMessageAction
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function __invoke(Uuid $messageId, Uuid $userId): void
    {
        $message = $this->messageRepository->findBy(['id' => $messageId, 'sender' => $userId]);

        if (empty($message)) {
            throw new \RuntimeException('Message not found or you do not have permission to edit it.');
        }

        $messageEntity = $message[0];
        $lastMessage = $messageEntity->getChat()->getLastMessage();
        if($messageEntity === $lastMessage) {
            $newLastMessage = $this->messageRepository->findBy(
                ['chat' => $messageEntity->getChat()->getId()],
                ['createdAt' => 'DESC'],
                1,
                1
            );
            $messageEntity->getChat()->setLastMessage($newLastMessage[0] ?? null);  
        }
        $this->messageRepository->delete($messageEntity);
    }
}
