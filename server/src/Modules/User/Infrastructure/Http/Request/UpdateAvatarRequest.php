<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateAvatarRequest
{
    // null = удалить аватар
    #[Assert\Length(max: 2048)]
    public ?string $avatarUrl = null;
}
