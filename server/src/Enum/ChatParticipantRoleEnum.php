<?php

namespace App\Enum;

enum ChatParticipantRoleEnum: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case MEMBER = 'member';
}
