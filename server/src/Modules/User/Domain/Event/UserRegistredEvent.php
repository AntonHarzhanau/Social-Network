<?php

namespace App\Modules\User\Domain\Event;

use App\Modules\User\Domain\Entity\User;

readonly class UserRegistredEvent
{
    public function __construct(
        protected User $user,
    ) {}

    public function getUser(): User
    {
        return $this->user;
    }
}
