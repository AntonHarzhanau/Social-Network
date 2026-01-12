<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Application\DTO\UserPreviewRowDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO as DTOUserPreviewRowDTO;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class GetUserPreviewsByIdsAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly MediaApiInterface $media,
    ) {}

    /** @return array<UserPreviewDTO> */
    public function execute(array $ids): array
    {
        /** @var UserPreviewRowDTO[] $rows */
        $rows = $this->users->findPreviewsByIds($ids);
        $previewIds = array_values(array_unique(array_filter(
            array_map(fn(DTOUserPreviewRowDTO $r) => $r->currentAvatar, $rows)
        )));

        $urlsById = $previewIds
            ? $this->media->getMediasByIds(null, $previewIds)
            : [];

        $result = [];
        foreach ($rows as $row) {
            $result[] = new UserPreviewDTO(
                id: $row->id,
                username: $row->username,
                avatarUrl: $row->currentAvatar ? ($urlsById[$row->currentAvatar]->url ?? null) : null,
                slug: $row->slug,
                wallId: $row->wallId,
            );
        }

        return $result;
    }
}
