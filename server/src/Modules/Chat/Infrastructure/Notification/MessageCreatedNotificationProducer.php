<?php

namespace App\Modules\Chat\Infrastructure\Notification;

use App\Modules\Chat\Domain\Event\MessageCreated;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Shared\Application\Message\UpsertNotification;
use App\Modules\Shared\Application\Notification\NotificationTypes;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Uid\Uuid;

final class MessageCreatedNotificationProducer implements EventSubscriberInterface
{
    public function __construct(
        private readonly MessageBusInterface $bus,
        private readonly ChatParticipantRepositoryInterface $participants,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            MessageCreated::class => 'onMessageCreated',
        ];
    }

    public function onMessageCreated(MessageCreated $event): void
    {
        $senderIdStr = $event->message['sender']['id'] ?? null;
        if (!$senderIdStr) {
            return;
        }

        $chatIdStr = $event->chatId;
        $senderId = Uuid::fromString($senderIdStr);

        $participants = $this->participants->findAllUsersIdByChatId(Uuid::fromString($chatIdStr));
        if (empty($participants)) {
            return;
        }

        $recipientIds = [];

        foreach ($participants as $participant) {
            if ($participant['userId'] === (string) $senderId)
                continue;
            $recipientIds[] = $participant['userId'];
        }

        if (empty($recipientIds))
            return;

        $groupKey = 'chat:' . $chatIdStr;

        $chatType = $event->chat['type'] ?? null;
        $chatTitle = $event->chat['title'] ?? "Untitled";
        $senderName = $event->message['sender']['name'] ?? "Unknown";

        $text = match ($chatType) {
            'direct' => \sprintf("New message from %s", $senderName),
            'group' => \sprintf("New message in %s from %s", $chatTitle, $senderName),
            default => "New message received",
        };

        $payload = [
            'source' => [
                'kind' => 'chat',
                'id' => $chatIdStr,
                'name' => $chatTitle,
                'avatarUrl' => $event->chat['avatarUrl'] ?? null,
            ],
            'chatId' => $chatIdStr,
            'messageId' => $event->message['id'] ?? '',
            'senderId' => $senderIdStr,
        ];
        
        $this->bus->dispatch(new UpsertNotification(
            type: NotificationTypes::CHAT_MESSAGE,
            recipientsIds: $recipientIds,
            text: $text,
            payload: $payload,
            groupKey: $groupKey,
            aggregate: true,
            private: false,
        ));

    }
}
