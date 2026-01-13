<?php

namespace App\Modules\Feed\Domain\Enum;

enum PostKindEnum: string
{
    case ORIGINAL = 'original';
    case RESHARE = 'reshare';
}
