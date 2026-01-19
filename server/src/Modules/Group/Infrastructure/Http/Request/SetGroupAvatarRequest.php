<?php

namespace App\Modules\Group\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;
final readonly class SetGroupAvatarRequest
{
    public function __construct(
        public ?string $avatarId = null,
    ) {
    }
}
