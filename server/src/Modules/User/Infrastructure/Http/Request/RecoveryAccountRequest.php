<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class RecoveryAccountRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,
    ) {}
}
