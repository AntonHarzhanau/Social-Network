<?php

namespace App\Modules\Notification\Infrastructure\Realtime;

use App\Modules\Notification\Domain\Entity\Notification;

final class NotificationRealtimeEventFactory
{
    public function event(
        string $action,                 // created|updated|deleted
        Notification $notification,
        int $unreadCount,
    ): array {
        return [
            'type' => 'notification_event',
            'action' => $action,
            'notification' => $this->notificationDto($notification),
            'unreadCount' => $unreadCount,
        ];
    }

    public function notificationDto(Notification $n): array
    {
        $group = null;
        if ($n->getGroupKey() !== null) {
            $group = [
                'key' => $n->getGroupKey(),
                'count' => $n->getGroupCount(),
            ];
        }

        $dto = [
            'id' => $n->getId()?->toRfc4122(),
            'type' => $n->getType()->value,
            'text' => $n->getText(),
            'source' => $n->getSource(),
            'payload' => $n->getPayload(),
            'group' => $group,
            'createdAt' => $n->getCreatedAt()->format(DATE_ATOM),
            'lastEventAt' => $n->getLastEventAt()?->format(DATE_ATOM),
        ];

        return $dto;
    }

    /**
     * Helper for deletion events if you ever need them.
     */
    public function deletedEvent(string $notificationId, int $unreadCount): array
    {
        return [
            'type' => 'notification_event',
            'action' => 'deleted',
            'notification' => [
                'id' => $notificationId,
            ],
            'unreadCount' => $unreadCount,
        ];
    }
}
