<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

interface PostRepositoryInterface
{
    public function save(Post $post, bool $flush = true): void;
    public function findOneById(Uuid $id): ?Post;
    public function remove(Post $post, bool $flush = true): void;

    /** @return list<PostFeedRowDTO> */
    public function findPosts(
        User $currentUser,
        ?Uuid $authorId = null,
        ?string $id = null,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array;

    public function findOneBy(array $criteria, array|null $orderBy = null): object|null;
}
