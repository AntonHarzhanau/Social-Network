<?php

namespace App\Modules\Comment\Domain\Repository;

use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Domain\Entity\User;

interface CommentRepositoryInterface
{
    public function save(Comment $comment, bool $flush = true): void;

    public function remove(Comment $comment, bool $flush = true): void;

    public function findRootForPost(
        Post $post,
        ?User $currentUser,
        int $page,
        int $limit
    ): array;

    public function findReplies(
        Comment $parentComment,
        int $page,
        int $limit
    ): array;
}
