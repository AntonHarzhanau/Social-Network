<?php

namespace App\Modules\Group\Domain\Enum;

enum GroupVisibilityEnum: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
}
