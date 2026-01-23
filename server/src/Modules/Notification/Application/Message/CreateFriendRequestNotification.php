<?php

namespace App\Modules\Notification\Application\Message;

use Symfony\Component\Uid\Uuid;

final readonly class CreateFriendRequestNotification
{
    public function __construct(
        public Uuid $friendshipId,
        public Uuid $requesterId,
        public Uuid $addresseeId,
    ) {}
}
