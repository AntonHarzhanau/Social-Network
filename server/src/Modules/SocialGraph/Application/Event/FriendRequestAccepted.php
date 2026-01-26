<?php

namespace App\Modules\SocialGraph\Application\Event;

use Symfony\Component\Uid\Uuid;

final readonly class FriendRequestAccepted
{
    public function __construct(
        public Uuid $friendshipId,
        public Uuid $requesterId,
        public Uuid $addresseeId,
        public \DateTimeImmutable $occurredAt = new \DateTimeImmutable(),
    ) {}
}
