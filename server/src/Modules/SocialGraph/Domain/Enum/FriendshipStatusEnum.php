<?php

namespace App\Modules\SocialGraph\Domain\Enum;

enum FriendshipStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
}
