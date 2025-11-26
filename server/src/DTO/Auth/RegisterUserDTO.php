<?php

namespace App\DTO\Auth;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class RegisterUserDTO
{
    public function __construct(
        #[Assert\Email]
        public ?string $email = null,

        #[Assert\NotBlank]
        public ?string $username = null,


        #[Assert\NotBlank]
        public ?string $password = null,

        #[Assert\NotBlank]
        #[Assert\Date]
        public ?string $dateOfBirth = null,
    ) {}
}
