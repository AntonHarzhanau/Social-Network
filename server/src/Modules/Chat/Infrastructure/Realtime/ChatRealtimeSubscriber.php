<?php

namespace App\Modules\Chat\Infrastructure\Realtime;

use App\Modules\Chat\Domain\Event\MessageCreated;
use App\Modules\Chat\Domain\Event\MessageDeleted;
use App\Modules\Chat\Domain\Event\MessageUpdated;
use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use App\Modules\Shared\Infrastructure\Realtime\Topics;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class ChatRealtimeSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly RealtimePublisherInterface $realtime,
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            MessageCreated::class => 'onMessageCreated',
            MessageUpdated::class => 'onMessageUpdated',
            MessageDeleted::class => 'onMessageDeleted',
        ];
    }

    public function onMessageCreated(MessageCreated $event): void
    {
        $topic = Topics::chat($event->chatId);

        $this->realtime->publish(
            $topic,
            [
                'type' => 'message_created',
                'message' => $event->message,
            ],
            private: false
        );
    }

    public function onMessageUpdated(MessageUpdated $event): void
    {
        $topic = Topics::chat($event->chatId);

        $this->realtime->publish(
            $topic,
            [
                'type' => 'message_updated',
                'messageId' => $event->messageId,
                'message' => $event->message,
            ],
            private: true
        );
    }

    public function onMessageDeleted(MessageDeleted $event): void
    {
        $topic = Topics::chat($event->chatId);

        $this->realtime->publish(
            $topic,
            [
                'type' => 'message_deleted',
                'messageId' => $event->messageId,
            ],
            private: false
        );
    }
}
