<?php

namespace App\Modules\Shared\Domain\Enum;

enum FriendshipStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
}
