<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\Command\AddComment;
use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\Uid\Uuid;

final class ReplyToCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly UserApiInterface $userApi,
    ) {}

    public function execute(
        Uuid $parentCommentId,
        Uuid $currentUserId,
        AddComment $cmd
    ) {
        $author = $this->userApi->findById($currentUserId);
        $parentComment = $this->commentRepository->findById($parentCommentId);
        
        if ($parentComment === null) {
            throw new \InvalidArgumentException('Parent comment not found.');
        }

        $comment = new Comment();
        $comment->setContent($cmd->content);
        $comment->setAuthor($author);
        $comment->setParent($parentComment);
        $parentComment->addReply($comment);
        $this->commentRepository->save($parentComment);
    }
}
