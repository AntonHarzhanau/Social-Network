<?php

namespace App\Modules\Group\Domain\Enum;

enum GroupVisibilityEnum: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';

    public static function values(): array
    {
        return array_map(static fn(self $c) => $c->value, self::cases());
    }
}
