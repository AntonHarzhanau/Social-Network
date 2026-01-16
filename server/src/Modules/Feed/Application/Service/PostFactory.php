<?php

namespace App\Modules\Feed\Application\Service;

use App\Modules\Feed\Application\DTO\PostResponse;
use App\Modules\Feed\Application\DTO\PostRowDTO;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;

class PostFactory
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly PostMediaBindingsService $postMediaBindingsService,
        private readonly GroupDirectoryInterface $groupDirectory,
    ) {}

    public function toPostResponse(
        PostRowDTO $row,
        $author = null,
        $wallOwner = null,
        array $postMedia = [],
    ): PostResponse {
        return new PostResponse(
            id: $row->id,
            wallId: $row->wallId,
            wallOwnerType: $row->wallOwnerType->value,
            // wallOwner: $wallOwner,
            author: $wallOwner,
            content: $row->content ?? '',
            commentThreadId: $row->commentThreadId,
            likeCount: $row->likeCount,
            commentCount: $row->commentCount,
            isLikedByCurrentUser: $row->isLikedByCurrentUser,
            createdAt: $row->createdAt,
            media: $postMedia[$row->id] ?? [],
            kind: $row->kind->value,
            originalPostId: $row->originalPostId,
            quote: $row->quote,
        );
    }

    /**
     * @param PostRowDTO[] $dtos
     * @return PostResponse[]
     */
    public function toPostListResponse(array $dtos): array
    {
        if ($dtos === []) return [];

        // ids
        $postIds = array_map(fn(PostRowDTO $r) => $r->id, $dtos);

        $authorIds = array_values(array_unique(array_map(fn(PostRowDTO $r) => $r->authorId, $dtos)));

        $wallIdsUser = [];
        $wallIdsGroup = [];
        foreach ($dtos as $r) {
            if ($r->wallOwnerType === WallOwnerTypeEnum::USER) {
                $wallIdsUser[] = $r->wallId;
            } else {
                $wallIdsGroup[] = $r->wallId;
            }
        }
        $wallIdsUser = array_values(array_unique($wallIdsUser));
        $wallIdsGroup = array_values(array_unique($wallIdsGroup));

        // authors
        $authors = $this->userDirectory->findPreviewsByIds($authorIds);
        $authorById = [];
        foreach ($authors as $a) {
            $authorById[$a->id] = $a;
        }

        // media
        $mediaByPostId = $this->postMediaBindingsService->getMediasForPosts($postIds);

        // wall owners by wallId
        $userOwnerByWallId = [];
        if ($wallIdsUser !== []) {
            $userOwners = $this->userDirectory->findPreviewsByWallIds($wallIdsUser);
            foreach ($userOwners as $u) {
                $userOwnerByWallId[$u->wallId] = $u;
            }
        }


        $groupOwnerByWallId = [];
        if ($wallIdsGroup !== []) {
            $groupOwners = $this->groupDirectory->findPreviewsByWallIds($wallIdsGroup);
            foreach ($groupOwners as $g) {
                $groupOwnerByWallId[$g->wallId] = $g;
            }
        }

        // build responses
        $posts = [];
        foreach ($dtos as $row) {
            $author = $authorById[$row->authorId] ?? null;

            $wallOwner = null;
            if ($row->wallOwnerType === WallOwnerTypeEnum::USER) {
                $wallOwner = $userOwnerByWallId[$row->wallId] ?? null;
            } else {
                $wallOwner = $groupOwnerByWallId[$row->wallId] ?? null;
            }

            $posts[] = $this->toPostResponse(
                row: $row,
                author: $wallOwner ?? null,
                wallOwner: $wallOwner,
                postMedia: $mediaByPostId,
            );
        }

        return $posts;
    }
}
