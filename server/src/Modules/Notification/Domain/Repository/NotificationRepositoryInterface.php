<?php

namespace App\Modules\Notification\Domain\Repository;

use App\Modules\Notification\Domain\Entity\Notification;
use Symfony\Component\Uid\Uuid;

interface NotificationRepositoryInterface
{
    public function save(Notification $notification, bool $flush = true): void;

    public function remove(Notification $notification, bool $flush = true): void;

    public function findAllByRecipientId(Uuid $recipientId): array;

    public function countUnread(Uuid $recipientId): int;

    public function findByRecipientId(Uuid $recipientId, int $page = 1, int $limit = 20): array;

    public function findById(Uuid $notificationId): ?Notification;

}
