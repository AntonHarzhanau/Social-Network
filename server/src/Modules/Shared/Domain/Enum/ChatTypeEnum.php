<?php

namespace App\Modules\Shared\Domain\Enum;

enum ChatTypeEnum: string
{
    case SELF = 'self';
    case DIRECT = 'direct';
    case GROUP = 'group';
}
