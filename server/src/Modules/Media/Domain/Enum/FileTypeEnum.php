<?php

namespace App\Modules\Media\Domain\Enum;

enum FileTypeEnum: string
{
    case IMAGE = 'image';
    case VIDEO = 'video';
    case AUDIO = 'audio';
    case DOCUMENT = 'document';
    case OTHER = 'other';
}
