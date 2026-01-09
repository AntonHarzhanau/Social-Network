<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateAvatarRequest
{
    // null = delete avatar 

    public ?string $originalFileId = null;
    
    public ?string $previewFileId = null;
}
