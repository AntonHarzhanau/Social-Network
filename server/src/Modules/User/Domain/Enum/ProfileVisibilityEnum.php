<?php

namespace App\Modules\User\Domain\Enum;

enum ProfileVisibilityEnum: string
{
    case PUBLIC = 'public';
    case FRIENDS = 'friends';
    case PRIVATE = 'private';

    public static function values(): array
    {
        return array_map(static fn(self $c) => $c->value, self::cases());
    }
}
