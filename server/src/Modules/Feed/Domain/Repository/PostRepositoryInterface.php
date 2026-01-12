<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Domain\Entity\Post;
use Symfony\Component\Uid\Uuid;

interface PostRepositoryInterface
{
    public function save(Post $post, bool $flush = true): void;
    public function findOneById(Uuid $id): ?Post;
    public function remove(Post $post, bool $flush = true): void;
    public function findOneBy(array $criteria, array|null $orderBy = null): object|null;
}
