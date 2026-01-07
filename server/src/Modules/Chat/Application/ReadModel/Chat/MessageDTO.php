<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\Chat\Domain\Entity\Message;

final class MessageDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $content,
        public readonly object $sender,
        public readonly string $createdAt,
    ) {}
}
