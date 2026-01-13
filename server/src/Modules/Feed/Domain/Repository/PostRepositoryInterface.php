<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Application\DTO\PostRowDTO;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;
use Symfony\Component\Uid\Uuid;

interface PostRepositoryInterface
{
    public function save(Post $post, bool $flush = true): void;
    public function remove(Post $post, bool $flush = true): void;
    public function findOneBy(array $criteria, array|null $orderBy = null): object|null;

    public function findFeed(
        Uuid $currentUser,
        ?array $wallIds,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null,
        ?array $statuses = null,
        ?WallOwnerTypeEnum $ownerType = null,
    ): array;

    public function findByWallId(
        Uuid $currentUser,
        Uuid $wallId,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null,
        ?array $statuses = null,
    ): array;

    public function findOnePostById(Uuid $currentUser, Uuid $postId): ?PostRowDTO;
    public function findOneById(Uuid $postId): ?Post;
}
