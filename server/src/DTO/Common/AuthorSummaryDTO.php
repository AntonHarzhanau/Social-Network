<?php

namespace App\DTO\Common;

final readonly class AuthorSummaryDTO
{
    public function __construct(
        public string $id,
        public string $username,
        public ?string $avatarUrl,
    ) {}
}
