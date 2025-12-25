<?php

namespace App\Modules\Shared\Domain\Enum;

enum FriendshipsTypeEnum: string
{
    case SENT = 'sent';
    case RECEIVED = 'received';
}
