<?php

namespace App\DTO\Chat;

use App\Modules\Identity\Domain\Entity\User;

final readonly class CreateDirectChatDTO
{
    public function __construct(
        public User $participant,
    ) {}
}
