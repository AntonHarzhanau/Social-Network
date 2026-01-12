<?php

namespace App\Modules\Feed\Application\Service;

use App\Modules\Feed\Application\DTO\PostContextDTO;
use App\Modules\Feed\Application\DTO\PostContextType;
use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\DTO\WallPostFeedRowDTO;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;

class PostFactory
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly PostMediaBindingsService $postMediaBindingsService,
        private readonly GroupDirectoryInterface $groupDirectory,
    ) {}

    public function toPostResponse(WallPostFeedRowDTO $row, $author = null, ?UserPreviewDTO $actor = null, array $postMedia = [], ?PostContextDTO $context = null): PostFeedItem
    {
        return new PostFeedItem(
            id: $row->postId,
            wallId: $row->wallId,
            context: $context,
            author: $author,
            actor: $actor,
            content: $row->content ?? '',
            commentThreadId: $row->commentThreadId,
            likeCount: $row->likeCount,
            commentCount: $row->commentCount,
            isLikedByCurrentUser: $row->likedByCurrentUser,
            date: $row->publishedAt,
            media: $postMedia[$row->postId] ?? [],
            publicationId: $row->publicationId,
            actorId: $row->actorId,
        );
    }

    public function toPostListResponse(array $dtos): array
    {
        $postIds = array_map(fn(WallPostFeedRowDTO $r) => $r->postId, $dtos);

        $authorIds = array_values(array_unique(array_map(fn($r) => $r->authorId, $dtos)));
        $authors = $this->userDirectory->findPreviewsByIds($authorIds);
        $authorById = [];
        foreach ($authors as $a) $authorById[$a->id] = $a;

        $actorIds = array_values(array_unique(array_filter(array_map(fn($r) => $r->actorId, $dtos))));
        $actorById = [];
        if ($actorIds !== []) {
            $actors = $this->userDirectory->findPreviewsByIds($actorIds);
            foreach ($actors as $a) $actorById[$a->id] = $a;
        }

        $mediaByPostId = $this->postMediaBindingsService->getMediasForPosts($postIds);
        $wallIds = array_values(array_unique(array_map(fn($r) => $r->wallId, $dtos)));
        
        $userByWall = $this->userDirectory->findPreviewsByWallIds($wallIds);
        $groupByWall = $this->groupDirectory->findPreviewsByWallIds($wallIds);
        
        $posts = [];
        foreach ($dtos as $row) {
            $author = $authorById[$row->authorId] ?? null;
            $actor  = $row->actorId ? ($actorById[$row->actorId] ?? null) : null;
            if (isset($groupByWall[$row->wallId])) {
                $context = new PostContextDTO(
                    type: PostContextType::GROUP,
                    user: null,
                    group: $groupByWall[$row->wallId],
                    );
                    } else {
                        $context = new PostContextDTO(
                            type: PostContextType::USER,
                            user: $userByWall[$row->wallId] ?? null,
                            group: null,
                            );
                            }
                            
            // dd($mediaByPostId);
            $posts[] = $this->toPostResponse(
                row: $row,
                author: $author,
                actor: $actor,
                postMedia: $mediaByPostId,
                context: $context,
            );
        }

        return $posts;
    }
}
