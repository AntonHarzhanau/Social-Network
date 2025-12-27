<?php

namespace App\Modules\SocialGraph\Domain\Enum;

enum FriendshipsTypeEnum: string
{
    case SENT = 'sent';
    case RECEIVED = 'received';
}
