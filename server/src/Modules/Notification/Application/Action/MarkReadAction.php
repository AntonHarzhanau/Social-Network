<?php

namespace App\Modules\Notification\Application\Action;

use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final readonly class MarkReadAction
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
    ) {
    }

    public function execute(Uuid $notificationId): void
    {

        $notification = $this->notificationRepository->findById($notificationId);
        if ($notification === null) {
            throw new \InvalidArgumentException('Notification not found');
        }
        $this->notificationRepository->remove($notification);
    }
}
