<?php

namespace App\Modules\Media\Domain\Repository;

interface PostMediaBindingRepositoryInterface
{
    public function findBindingRowsByPostIds(array $postIds): array;
}
