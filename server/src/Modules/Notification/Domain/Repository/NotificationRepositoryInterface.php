<?php

namespace App\Modules\Notification\Domain\Repository;

use App\Modules\Notification\Domain\Entity\Notification;
use Symfony\Component\Uid\Uuid;

interface NotificationRepositoryInterface
{
   public function save(Notification $notification): void; 

   public function countUnread(Uuid $recipientId): int;

   public function findByRecipientId(Uuid $recipientId, int $page = 1, int $limit = 20): array;

   public function findById(Uuid $notificationId): ?Notification;

   public function findAllByRecipientId(Uuid $recipientId): array;
}
