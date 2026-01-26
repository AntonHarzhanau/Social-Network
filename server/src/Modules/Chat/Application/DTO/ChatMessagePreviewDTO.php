<?php

namespace App\Modules\Chat\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class ChatMessagePreviewDTO
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $content,
        public readonly string $createdAt,
        public readonly ?UserPreviewDTO $sender,
    ) {}
}
