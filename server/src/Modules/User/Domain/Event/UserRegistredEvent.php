<?php

namespace App\Modules\User\Domain\Event;

use App\Modules\User\Domain\Entity\User;

readonly class UserRegistredEvent
{
    public function __construct(
        protected User $user,
        protected ?string $ip = null,
        protected ?string $userAgent = null,
    ) {}

    public function getUser(): User
    {
        return $this->user;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function getUserAgent(): ?string
    {
        return $this->userAgent;
    }
}
