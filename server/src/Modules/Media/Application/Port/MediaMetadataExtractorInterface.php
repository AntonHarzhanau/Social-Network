<?php

namespace App\Modules\Media\Application\Port;

use App\Modules\Media\Application\DTO\MediaMetadata;
use App\Modules\Media\Domain\Enum\FileTypeEnum;

interface MediaMetadataExtractorInterface
{
    public function extract(string $localPath, FileTypeEnum $fileType, ?string $mimeType = null): MediaMetadata;
}
