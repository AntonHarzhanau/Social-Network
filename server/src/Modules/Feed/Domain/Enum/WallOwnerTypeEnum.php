<?php
namespace App\Modules\Feed\Domain\Enum;

enum WallOwnerTypeEnum: string
{
    case USER = 'user';
    case GROUP = 'group';
}
