<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class GetUserPreviewsByWallIdsAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly MediaApiInterface $media,
        private readonly UserMapper $mapper,
    ) {
    }

    /** @return array<UserPreviewDTO> */
    public function execute(array $ids): array
    {

        /** @var UserPreviewRowDTO[] $rows */
        $rows = $this->users->findPreviewByWallIds($ids);
        $previewIds = array_values(array_unique(array_filter(
            array_map(fn(UserPreviewRowDTO $r) => $r->currentAvatar, $rows)
        )));

        $urlsById = $previewIds
            ? $this->media->getMediasByIds(null, $previewIds)
            : [];

        $result = [];
        foreach ($rows as $row) {
            $result[] = $this->mapper->toPreview(
                $row,
                $row->currentAvatar ? ($urlsById[$row->currentAvatar]->url ?? null) : null
            );
        }

        return $result;
    }
}
