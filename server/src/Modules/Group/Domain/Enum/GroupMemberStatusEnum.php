<?php

namespace App\Modules\Group\Domain\Enum;

enum GroupMemberStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case BANNED = 'banned';
}
