<?php

namespace App\Modules\Notification\Infrastructure\Messenger\Handler;

use App\Modules\Notification\Domain\Entity\Notification;
use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;
use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use App\Modules\Notification\Infrastructure\Realtime\NotificationRealtimeEventFactory;
use App\Modules\Shared\Application\Message\UpsertNotification;
use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use App\Modules\Shared\Infrastructure\Realtime\Topics;
use App\Modules\User\Domain\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class UpsertNotificationHandler
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly RealtimePublisherInterface $realtimePublisher,
        private readonly NotificationRealtimeEventFactory $eventFactory,
    ) {
    }

    public function __invoke(UpsertNotification $message): void
    {
        if ($message->recipientsIds === []) {
            return;
        }

        $recipientsRefs = [];
        foreach ($message->recipientsIds as $recipientId) {
            $recipientsRefs[$recipientId] = $this->entityManager->getReference(User::class, $recipientId);
        }

        $existingMap = [];
        if ($message->aggregate && $message->groupKey) {
            $existingMap = $this->notificationRepository->findGroupedForRecipients(recipientIds: $message->recipientsIds, type: NotificationTypeEnum::from($message->type), groupKey: $message->groupKey);
        }

        $toPublish = [];

        foreach ($message->recipientsIds as $recipientId) {
            $existing = $existingMap[$recipientId] ?? null;

            if ($existing && $message->aggregate && $message->groupKey) {
                $existing->aggregate($message->text, $message->payload);
                $notification = $existing;
                $action = 'updated';
            } else {
                $notification = new Notification(
                    recipient: $recipientsRefs[$recipientId],
                    type: NotificationTypeEnum::from($message->type),
                    text: $message->text,
                    payload: $message->payload,
                    groupKey: $message->groupKey,
                );
                $action = 'created';
            }
            $this->notificationRepository->save($notification, flush: false);
            $toPublish[$recipientId] = ['action' => $action, 'notification' => $notification];
        }
        $this->entityManager->flush();

        $counts = $this->notificationRepository->countUnreadByRecipients($message->recipientsIds);

        foreach ($toPublish as $recipientId => $row) {
            $unread = $counts[$recipientId] ?? 0;

            $this->realtimePublisher->publish(
                topics: Topics::userNotifications($recipientId),
                data: $this->eventFactory->event(
                    action: $row['action'],
                    notification: $row['notification'],
                    unreadCount: $unread,
                ),
                private: $message->private,

            );
        }
    }
}
