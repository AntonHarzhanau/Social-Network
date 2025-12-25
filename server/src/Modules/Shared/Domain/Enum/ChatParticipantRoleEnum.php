<?php

namespace App\Modules\Shared\Domain\Enum;

enum ChatParticipantRoleEnum: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
}
