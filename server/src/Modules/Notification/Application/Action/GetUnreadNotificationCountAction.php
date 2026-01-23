<?php


namespace App\Modules\Notification\Application\Action;

use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetUnreadNotificationCountAction
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository
    )
    {
    }

    public function execute(Uuid $userId): int
    {
        return $this->notificationRepository->countUnread($userId);
    }
}
