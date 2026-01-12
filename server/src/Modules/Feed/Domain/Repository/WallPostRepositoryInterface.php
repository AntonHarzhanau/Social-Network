<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Application\DTO\WallPostFeedRowDTO;
use App\Modules\Feed\Domain\Entity\WallPost;
use Symfony\Component\Uid\Uuid;

interface WallPostRepositoryInterface
{
    public function save(WallPost $wallPost, bool $flush = true): void;
    public function delete(WallPost $wallPost, bool $flush = true): void;

    public function findMixedFeed(
        Uuid $currentUser,
        array $wallIds,
        ?int $page = null,
        ?int $limit = null,
        bool $includePublicAlso = true
    ): array;

    public function findPostsByIds(Uuid $currentUserId, Uuid $postId): ?WallPostFeedRowDTO;

    public function findWallFeed(
        Uuid $currentUser,
        Uuid $wallId,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array;
}
