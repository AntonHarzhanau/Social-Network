<?php

namespace App\Modules\Comment\Domain\Repository;

use App\Modules\Comment\Domain\Entity\CommentThread;
use Symfony\Component\Uid\Uuid;

interface CommentThreadRepositoryInterface
{
    // public function save(CommentThread $commentThread, bool $flush = true): void;

    // public function dalete(CommentThread $commentThread, bool $flush = true): void;

    public function findThreadById(Uuid $threadId): ?CommentThread;
}
