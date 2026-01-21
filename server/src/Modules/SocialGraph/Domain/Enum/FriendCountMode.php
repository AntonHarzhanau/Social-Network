<?php

namespace App\Modules\SocialGraph\Domain\Enum;

enum FriendCountMode: string
{
    case FRIENDS = 'friends';
    case INCOMING_REQUESTS = 'incoming';
    case OUTGOING_REQUESTS = 'outgoing';
}
