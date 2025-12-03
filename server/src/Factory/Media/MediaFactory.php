<?php

namespace App\Factory\Media;

use App\DTO\Media\MediaResponseDTO;
use App\Entity\MediaAsset;

class MediaFactory
{
    public function toResponseDTO(MediaAsset $media, string $url): MediaResponseDTO
    {
        return new MediaResponseDTO(
            id: $media->getId(),
            fileType: $media->getFileType(),
            url: $url,
            createdAt: $media->getCreatedAt()->format(\DateTime::ATOM),
        );
    }
}
