<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\DTO\CommentCountUpdatedResponse;
use App\Modules\Comment\Application\Port\PostDirectoryInterface;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly PostDirectoryInterface $postDirectory,
    ) {}

    public function execute(Uuid $commentId, Uuid $currentUser): CommentCountUpdatedResponse
    {
        $comment = $this->commentRepository->findById($commentId);
        
        $post = $this->postDirectory->getPostByAuthor($currentUser);
        if ($comment === null) {
            throw new \InvalidArgumentException('Comment not found.');
        }

        if ($comment->getAuthor()->getId() !== $currentUser || !$post) {
            throw new \InvalidArgumentException('You do not have permission to delete this comment.');
        }
        
        $thread = $comment->getThread();
        if ($thread !== null) {
            $thread->setCommentCount($thread->getCommentCount() - 1);
        }
        

        $this->commentRepository->remove($comment);

        $dto = new CommentCountUpdatedResponse(
            threadId: $thread?->getId()->toRfc4122(),
            commentCount: $thread?->getCommentCount(),
        );
        return $dto;
    }
}
