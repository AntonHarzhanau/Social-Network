<?php

namespace App\Modules\Feed\Application\Service;

use App\Modules\Feed\Application\DTO\PostResponse;
use App\Modules\Feed\Application\DTO\PostRowDTO;
use App\Modules\Feed\Application\DTO\WallOwnerPreviewDTO;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;
use Symfony\Component\Uid\Uuid;

class PostFactory
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly PostMediaBindingsService $postMediaBindingsService,
        private readonly GroupDirectoryInterface $groupDirectory,
    ) {
    }

    public function toPostResponse(
        PostRowDTO $row,
        $author = null,
        $wallOwner = null,
        array $postMedia = [],
        bool $canDelete,
    ): PostResponse {
        return new PostResponse(
            id: $row->id,
            wallId: $row->wallId,
            wallOwner: $wallOwner,

            author: $author,
            content: $row->content ?? '',
            commentThreadId: $row->commentThreadId,

            likeCount: $row->likeCount,
            commentCount: $row->commentCount,
            isLikedByCurrentUser: $row->isLikedByCurrentUser,

            createdAt: $row->createdAt,
            media: $postMedia[$row->id] ?? [],
            canDelete: $canDelete,

            kind: $row->kind->value,
        );
    }

    /**
     * @param PostRowDTO[] $dtos
     * @return PostResponse[]
     */
    public function toPostListResponse(Uuid $currentUserId, array $dtos): array
    {
        if ($dtos === [])
            return [];

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
            $groupOwners = $this->groupDirectory->findPreviewsByWallIds($currentUserId, $wallIdsGroup);
            foreach ($groupOwners as $g) {
                $groupOwnerByWallId[$g->wallId] = $g;
            }
        }
        
        // build responses
        $posts = [];
        foreach ($dtos as $row) {
            $author = $authorById[$row->authorId] ?? null;

            $wallOwner = $row->wallOwnerType === WallOwnerTypeEnum::USER
                ? $wallOwner = new WallOwnerPreviewDTO(
                    id: $userOwnerByWallId[$row->wallId]->id,
                    type: WallOwnerTypeEnum::USER->value,
                    name: $userOwnerByWallId[$row->wallId]->name,
                    avatarUrl: $userOwnerByWallId[$row->wallId]->avatarUrl,
                    wallId: $row->wallId,
                    isOnline: $userOwnerByWallId[$row->wallId]->isOnline,
                )
                : $wallOwner = new WallOwnerPreviewDTO(
                    id: $groupOwnerByWallId[$row->wallId]->id,
                    type: WallOwnerTypeEnum::GROUP->value,
                    name: $groupOwnerByWallId[$row->wallId]->name,
                    avatarUrl: $groupOwnerByWallId[$row->wallId]->avatarUrl,
                    wallId: $row->wallId,
                    isOnline: false,
                );
                $canDelete = ($row->wallOwnerType === WallOwnerTypeEnum::USER)
                ? $row->authorId === (string)$currentUserId 
                : $groupOwnerByWallId[$row->wallId]->role === 'owner' 
                    || $groupOwnerByWallId[$row->wallId]->role === 'admin';

            $posts[] = $this->toPostResponse(
                row: $row,
                author: $author,
                wallOwner: $wallOwner,
                postMedia: $mediaByPostId,
                canDelete: $canDelete,
            );
        }

        return $posts;
    }
}
