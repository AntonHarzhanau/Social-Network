<?php

namespace App\Modules\Feed\Domain\Enum;

enum WallPostKindEnum: string
{
    case ORIGINAL = 'ORIGINAL';
    case RESHARE = 'RESHARE';
}
