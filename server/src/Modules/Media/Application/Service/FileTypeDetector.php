<?php

namespace App\Modules\Media\Application\Service;

use App\Modules\Media\Domain\Enum\FileTypeEnum;

final class FileTypeDetector
{
    public function detect(?string $mimeType): FileTypeEnum
    {
        if ($mimeType === null) {
            return FileTypeEnum::OTHER;
        }

        if (str_starts_with($mimeType, 'image/')) {
            return FileTypeEnum::IMAGE;
        }

        if (str_starts_with($mimeType, 'video/')) {
            return FileTypeEnum::VIDEO;
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return FileTypeEnum::AUDIO;
        }

        if (in_array($mimeType, ['application/pdf', 'application/msword'])) {
            return FileTypeEnum::DOCUMENT;
        }

        return FileTypeEnum::OTHER;
    }
}
