<?php

namespace App\Modules\Chat\Domain\Enum;

enum ChatParticipantRoleEnum: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
}
