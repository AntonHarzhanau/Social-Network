<?php

namespace App\Modules\Group\Domain\Enum;

enum GroupMemberRoleEnum: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
}
