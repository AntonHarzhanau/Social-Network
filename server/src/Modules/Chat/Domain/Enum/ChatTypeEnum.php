<?php

namespace App\Modules\Chat\Domain\Enum;

enum ChatTypeEnum: string
{
    case SELF = 'self';
    case DIRECT = 'direct';
    case GROUP = 'group';
}
