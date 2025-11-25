<?php

namespace App\Enum;

enum VisibilityEnum: string
{
    case PUBLIC = 'public';
    case FRIENDS = 'friends';
    case PRIVATE = 'private';
    case GROUP = 'group';
}
