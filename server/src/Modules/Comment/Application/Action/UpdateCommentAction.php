<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\Command\AddComment;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final class UpdateCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
    ) {}

    public function __invoke(Uuid $commentId, Uuid $currentUserId, AddComment $cmd): void
    {
        $comment = $this->commentRepository->findById($commentId);
        if ($comment === null) {
            throw new \InvalidArgumentException('Comment not found.');
        }
        if ($comment->getAuthor()->getId() !== $currentUserId) {
            throw new AccessDeniedException('User is not the author of the comment.');
        }

        $comment->setContent($cmd->content);
        $this->commentRepository->save($comment);
    }
}
