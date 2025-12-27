<?php

namespace App\Modules\Group\Domain\Enum;

enum GroupMemberRoleEnum: string
{
    case ADMIN = 'admin';
    case MEMBER = 'member';
}
