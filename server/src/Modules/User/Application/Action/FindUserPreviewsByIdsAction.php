<?php

namespace App\Modules\User\Application\Action;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Application\DTO\UserPreviewRowDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO as DTOUserPreviewRowDTO;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class FindUserPreviewsByIdsAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly MediaApiInterface $media, // порт в Media модуль
    ) {}

    /** @return array<UserPreviewDTO> */
    public function execute(array $ids): array
    {
        /** @var UserPreviewRowDTO[] $rows */
        $rows = $this->users->findPreviewsByIds($ids);

        $previewIds = array_values(array_unique(array_filter(
            array_map(fn(DTOUserPreviewRowDTO $r) => $r->currentAvatar, $rows)
        )));

        // 1 батч-вызов вместо N вызовов
        $urlsById = $previewIds
            ? $this->media->getMediasByIds($previewIds)
            : [];

        $result = [];
        foreach ($rows as $row) {
            $result[] = new UserPreviewDTO(
                id: $row->id,
                username: $row->username,
                avatarUrl: $row->currentAvatar ? ($urlsById[$row->currentAvatar]->url ?? null) : null,
                slug: $row->slug
            );
        }

        return $result;
    }
}
