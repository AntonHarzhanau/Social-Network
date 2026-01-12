<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Domain\Entity\PostMediaBinding;

interface PostMediaBindingRepositoryInterface
{
    public function save(PostMediaBinding $entity, bool $flush = true): void;
    public function findBindingRowsByPostIds(array $postIds): array;
}
