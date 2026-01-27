<?php

namespace App\Modules\Chat\Infrastructure\Realtime;

use App\Modules\Chat\Domain\Event\ChatRead;
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
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            MessageCreated::class => 'onMessageCreated',
            MessageUpdated::class => 'onMessageUpdated',
            MessageDeleted::class => 'onMessageDeleted',
            ChatRead::class => 'onChatRead',
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
            private: false
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

    public function onChatRead(ChatRead $event): void
    {
        $this->realtime->publish(
            Topics::chat($event->chatId),
            [
                'type' => 'chat_read',
                'userId' => (string) $event->readerId,
                'lastReadAt' => $event->lastReadAt->format(DATE_ATOM),
                'lastReadMessageId' => $event->lastReadMessageId,
            ],
            private: false
        );
    }
}
