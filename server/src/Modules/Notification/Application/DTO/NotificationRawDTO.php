<?php

namespace App\Modules\Notification\Application\DTO;

use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;

final readonly class NotificationRawDTO
{
    public function __construct(
        public string $id,
        public NotificationTypeEnum $type,
        public string $text,
        public array  $payload,
        public \DateTimeImmutable $createdAt,
    ) {
    }
}
