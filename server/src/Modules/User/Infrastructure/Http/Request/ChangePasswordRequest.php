<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class ChangePasswordRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public readonly string $oldPassword,

        #[Assert\NotBlank]
        
        #[Assert\Length(min: 4, max: 4096)]

        // #[Assert\NotCompromisedPassword]
        public readonly string $newPassword,
    ) {}
}
