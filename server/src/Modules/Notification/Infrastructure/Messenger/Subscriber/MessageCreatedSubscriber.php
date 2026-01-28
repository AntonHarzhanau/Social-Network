<?php

namespace App\Modules\Notification\Infrastructure\Messenger\Subscriber;

use App\Modules\Chat\Domain\Event\MessageCreated;
use App\Modules\Notification\Application\Message\ChatMessageNotification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Uid\Uuid;

final class MessageCreatedSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly \Psr\Log\LoggerInterface $logger,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [MessageCreated::class => 'onMessageCreated'];
    }

    public function onMessageCreated(MessageCreated $event): void
    {
$this->logger->info('MessageCreatedSubscriber fired', [
            'chatId' => $event->chatId,
        ]);

        $senderId = $event->message['sender']['id'] ?? null;
        if (!$senderId)
            return;

        $this->bus->dispatch(new ChatMessageNotification(
            chatId: Uuid::fromString($event->chatId),
            senderId: Uuid::fromString($senderId),
            messagePayload: $event->message,
            chatSnapshot: $event->chat ?? [],
        ));
    }
}
