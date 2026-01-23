<?php

namespace App\Modules\Notification\Application\Action;

use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final readonly class MarkAllReadAction
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
    ) {
    }

    public function execute(Uuid $currentUserId): void
    {
        $notifications = $this->notificationRepository->findAllByRecipientId($currentUserId);
        $count = 0;
        foreach ($notifications as $notification) {
            $this->notificationRepository->remove($notification, false);
            $count++;
        }
        $this->notificationRepository->save($notification);
    }
}
