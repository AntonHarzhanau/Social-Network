<?php

namespace App\Modules\Media\Application\Mapper;

use App\Modules\Media\Api\DTO\MediaItemDTO;
use App\Modules\Media\Application\DTO\MediaItemRowDTO;
use App\Modules\Media\Application\Service\GetMediaUrl;

final class MediaItemMapper
{
    public function __construct(private readonly GetMediaUrl $urlResolver) {}

    public function fromRow(MediaItemRowDTO $row): MediaItemDTO
    {
        return new MediaItemDTO(
            id: $row->id->toRfc4122(),
            url: ($this->urlResolver)($row->storageKey),
            type: $row->type->value,
            createdAt: $row->createdAt,
            width: $row->width,
            height: $row->height,
            durationSeconds: $row->durationSeconds,
            commentThreadId: $row->commentThreadId->toRfc4122(),
            likeCount: $row->likeCount,
            likedByCurrentUser: $row->likedByCurrentUser,
        );
    }
}
