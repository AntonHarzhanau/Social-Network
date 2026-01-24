<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class MessageResponseDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $content,
        public readonly array $sender,
        public readonly string $createdAt,
    ) {}
}
