<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class EditMessageAction
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function __invoke(Uuid $messageId, Uuid $userId, NewMessage $dto): void
    {
        $message = $this->messageRepository->findBy(['id' => $messageId, 'sender' => $userId]);

        if (empty($message)) {
            throw new \RuntimeException('Message not found or you do not have permission to edit it.');
        }

        $messageEntity = $message[0];
        $messageEntity->setContent($dto->content);
        $messageEntity->setUpdatedAt(new \DateTimeImmutable());
        $this->messageRepository->save($messageEntity);
    }
}
