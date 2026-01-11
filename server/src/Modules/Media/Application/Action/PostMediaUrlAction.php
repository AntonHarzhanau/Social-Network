<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\Mapper\MediaItemMapper;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use App\Modules\Media\Domain\Repository\PostMediaBindingRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class PostMediaUrlAction
{
    public function __construct(
         private readonly PostMediaBindingRepositoryInterface $bindingRepo,
        private readonly MediaAssetRepositoryInterface $mediaRepo,
        private readonly MediaItemMapper $mediaItemMapper,
    ) {}

    /** @return array<string, list<string>> */
    public function __invoke(Uuid $currentUserId, array $postIds): array
    {
        if ($postIds === []) return [];

        $bindingRows = $this->bindingRepo->findBindingRowsByPostIds($postIds);

        $mediaIdsByPost = [];
        $allMediaIdsSet = [];

        foreach ($bindingRows as $r) {
            $pid = (string) $r['postId'];
            $mid = (string) $r['mediaId'];

            $mediaIdsByPost[$pid][] = $mid;
            $allMediaIdsSet[$mid] = true;
        }

        $allMediaIds = array_keys($allMediaIdsSet);
        if ($allMediaIds === []) {
            $out = [];
            foreach ($postIds as $pid) $out[$pid] = [];
            return $out;
        }

        $rows = $this->mediaRepo->findMediaRowsByIds($currentUserId, $allMediaIds);

        $mediaById = [];
        foreach ($rows as $row) {
            $dto = $this->mediaItemMapper->fromRow($row);
            $mediaById[$dto->id] = $dto;
        }

        $result = [];
        foreach ($postIds as $pid) {
            $orderedIds = $mediaIdsByPost[$pid->toRfc4122()] ?? [];
            $items = [];
   
            foreach ($orderedIds as $mid) {
                if (isset($mediaById[$mid])) {
                    $items[] = $mediaById[$mid];
                }
            }

            $result[$pid->toRfc4122()] = $items;
        }

        return $result;
    }
}
