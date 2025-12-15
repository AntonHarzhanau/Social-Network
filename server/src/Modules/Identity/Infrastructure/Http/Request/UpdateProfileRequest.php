<?php

namespace App\Modules\Identity\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateProfileRequest
{
    #[Assert\Length(min: 2, max: 100)]
    public ?string $username = null;

    #[Assert\Length(max: 100)]
    public ?string $location = null;

    #[Assert\Length(max: 3000)]
    public ?string $bio = null;

    #[Assert\Length(max: 2048)]
    public ?string $coverUrl = null;

    #[Assert\Length(max: 30)]
    public ?string $maritalStatus = null;
}
