<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class RegisterRequest
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[Assert\NotBlank]
    #[Assert\Length(min: 1, max: 80)]
    public string $firstName;

    #[Assert\NotBlank]
    #[Assert\Length(min: 1, max: 80)]
    public string $lastName;

    #[Assert\NotBlank]
    #[Assert\Length(min: 4, max: 255)]
    public string $password;

    #[Assert\NotBlank]
    #[Assert\Date]
    public string $dateOfBirth;
}
