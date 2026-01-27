<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Domain\Event\MessageUpdated;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\Shared\Application\Port\EventBusInterface;
use Symfony\Component\Uid\Uuid;

final class EditMessageAction
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly EventBusInterface $eventBus,
    ) {
    }

    public function __invoke(Uuid $messageId, Uuid $userId, NewMessage $dto): void
    {
        $message = $this->messageRepository->findOneBy(['id' => $messageId, 'sender' => $userId]);


        if (!$message) {
            throw new \RuntimeException('Message not found or you do not have permission to edit it.');
        }


        $message->setContent($dto->content);
        $message->setUpdatedAt(new \DateTimeImmutable());
        $this->messageRepository->save($message);

        $this->eventBus->dispatch(
            new MessageUpdated(
                $message->getChat()->getId()->toRfc4122(),
                $message->getId()->toRfc4122(),
                [
                    'id' => (string) $message->getId(),
                    'sender' => [
                        'id' => (string) $message->getSender()->getId(),
                        'name' => $message->getSender()->getUsername(),
                        'avatarUrl' => $message->getSender()->getAvatarUrl(),
                        'slug' => $message->getSender()->getSlug(),
                    ],
                    'content' => $message->getContent(),
                    'createdAt' => $message->getCreatedAt()->format(\DateTime::ATOM),
                ]
            )
        );
    }
}
