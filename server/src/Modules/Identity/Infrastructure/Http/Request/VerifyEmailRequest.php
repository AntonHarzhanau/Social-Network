<?php

namespace App\Modules\Identity\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class VerifyEmailRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 256)]
    public string $token;
}
