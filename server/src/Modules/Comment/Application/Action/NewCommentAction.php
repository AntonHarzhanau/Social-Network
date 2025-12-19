<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\Command\AddComment;
use App\Modules\Comment\Application\Port\PostDirectoryInterface;
use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;

use Symfony\Component\Uid\Uuid;

final class NewCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly UserDirectoryInterface $userApi,
        private readonly PostDirectoryInterface $postDirectory,
    ) {}

    public function __invoke(AddComment $cmd, Uuid $currentUserId, Uuid $postId): void
    {
        $author = $this->userApi->getUser($currentUserId);
        $post = $this->postDirectory->getPost($postId);

        if ($post === null) {
            throw new \InvalidArgumentException('Post not found.');
        }

        $comment = new Comment();
        $comment->setContent($cmd->content);
        $comment->setAuthor($author);
        $comment->setPost($post);
        $this->commentRepository->save($comment);

    }
}
