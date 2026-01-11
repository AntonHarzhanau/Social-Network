<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\Command\AddComment;
use App\Modules\Comment\Application\DTO\CommentCountUpdatedResponse;
use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\Comment\Domain\Repository\CommentThreadRepositoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;

use Symfony\Component\Uid\Uuid;

final class NewCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly UserDirectoryInterface $userApi,
        private readonly CommentThreadRepositoryInterface $commentThreadRepository,
    ) {}

    public function execute(AddComment $cmd, Uuid $currentUserId, Uuid $threadId): CommentCountUpdatedResponse
    {
        $author = $this->userApi->getUser($currentUserId);
        $thread = $this->commentThreadRepository->findThreadById($threadId);

        if ($thread === null) {
            throw new \InvalidArgumentException('Thread not found.');
        }

        $comment = new Comment();
        $comment->setContent($cmd->content);
        $comment->setAuthor($author);

        $thread->addComment($comment);
        $thread->setCommentCount($thread->getCommentCount() + 1);
      
        $this->commentRepository->save($comment);

        $dto = new CommentCountUpdatedResponse(
            threadId: $thread->getId()->toRfc4122(),
            commentCount: $thread->getCommentCount(),
        );        

        return $dto;
    }
}
