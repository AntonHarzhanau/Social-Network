<?php

namespace App\Modules\User\Application\Service;

final class PresenceService
{
    private const ONLINE_THRESHOLD_SECONDS = 300;
    public function isUserOnline(?\DateTimeImmutable $lastLoginAt): bool
    {
        $now = new \DateTimeImmutable();

        if (!$lastLoginAt instanceof \DateTimeInterface) {
            return false;
        }

        $lastActiveAt = \DateTimeImmutable::createFromInterface($lastLoginAt);
        return ($now->getTimestamp() - $lastActiveAt->getTimestamp()) <= self::ONLINE_THRESHOLD_SECONDS;
    }
}
