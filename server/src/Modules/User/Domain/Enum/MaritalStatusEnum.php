<?php

namespace App\Modules\User\Domain\Enum;

enum MaritalStatusEnum: string
{
    case SINGLE = 'single';
    case MARRIED = 'married';
    case DIVORCED = 'divorced';
    case WIDOWED = 'widowed';

    public static function values(): array
    {
        return array_map(static fn(self $c) => $c->value, self::cases());
    }

    public static function valuesWithNull(): array
    {
        $v = self::values();
        $v[] = null;
        return $v;
    }
}
