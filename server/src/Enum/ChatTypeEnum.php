<?php

namespace App\Enum;

enum ChatTypeEnum: string
{
    case SELF = 'self';
    case DIRECT = 'direct';
    case GROUP = 'group';
}
