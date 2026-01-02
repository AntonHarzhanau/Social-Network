<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateAvatarRequest
{
    // null = удалить аватар

    public string $originalFileId;
    
    public string $previewFileId;
}
