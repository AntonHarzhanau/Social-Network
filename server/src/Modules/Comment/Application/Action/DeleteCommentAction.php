<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
    ) {}

    public function __invoke(Uuid $commentId, Uuid $currentUser): void
    {
        $comment = $this->commentRepository->findById($commentId);
        if ($comment === null) {
            throw new \InvalidArgumentException('Comment not found.');
        }

        if ($comment->getAuthor()->getId() !== $currentUser 
         && $comment->getPost()->getAuthor()->getId() !== $currentUser) {
            throw new \InvalidArgumentException('You do not have permission to delete this comment.');
        }

        $this->commentRepository->remove($comment);
    }
}
