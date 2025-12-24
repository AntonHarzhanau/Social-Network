<?php

namespace App\DTO\Chat;

use App\Modules\User\Domain\Entity\User;

final readonly class CreateDirectChatDTO
{
    public function __construct(
        public User $participant,
    ) {}
}
