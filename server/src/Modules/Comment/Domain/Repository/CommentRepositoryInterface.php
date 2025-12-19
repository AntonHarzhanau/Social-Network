<?php

namespace App\Modules\Comment\Domain\Repository;

use App\Modules\Comment\Domain\Entity\Comment;
use Symfony\Component\Uid\Uuid;

interface CommentRepositoryInterface
{
    public function save(Comment $comment, bool $flush = true): void;

    public function remove(Comment $comment, bool $flush = true): void;

    public function findRootForPost(
        Uuid $post,
        Uuid $currentUser,
        int $page,
        int $limit
    ): array;

    public function findReplies(
        Comment $parentComment,
        Uuid $currentUser,
        int $page,
        int $limit
    ): array;

    public function findById(Uuid $id): ?Comment;
}
