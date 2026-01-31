<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateCoverRequest
{
    // null = delete cover 
    public ?string $imageId = null;
}
