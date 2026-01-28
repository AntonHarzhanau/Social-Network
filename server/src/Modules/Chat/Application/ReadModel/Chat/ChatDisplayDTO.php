<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

final readonly class ChatDisplayDTO
{
    public function __construct(
        public ?string $title,
        public ?string $avatarUrl,
    ) {}
}
