<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Identity\Domain\Entity\User;

interface PostRepositoryInterface
{
    public function save(Post $post, bool $flush = true): void;
    public function remove(Post $post, bool $flush = true): void;
    public function findPosts(
        User $currentUser,
        ?User $author = null,
        ?string $id = null,
        ?int $page = null,
        ?int $limit = null,
        ?array $visibilities = null
    ): array;
}
