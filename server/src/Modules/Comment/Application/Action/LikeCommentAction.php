<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\DTO\ToggleLikeResponse;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use Symfony\Component\Uid\Uuid;

final class LikeCommentAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly UserDirectoryInterface $userApi,
    ) {}

    public function execute(Uuid $comment, Uuid $currentUser): ToggleLikeResponse
    {
        $comment = $this->commentRepository->findById($comment);

        $user = $this->userApi->getUser($currentUser);
        if ($comment === null) {
            throw new \InvalidArgumentException('Comment not found.');
        }

        if ($comment->getLikeBy()->contains($user)) {
            $comment->getLikeBy()->removeElement($user);
            $comment->setLikeCount($comment->getLikeCount() - 1);
        } else {
            $comment->getLikeBy()->add($user);
            $comment->setLikeCount($comment->getLikeCount() + 1);
        }
        $this->commentRepository->save($comment);

        $dto = new ToggleLikeResponse(
            commentId: $comment->getId()->toRfc4122(),
            likeCount: $comment->getLikeCount(),
            isLikedByCurrentUser: $comment->getLikeBy()->contains($user),
        );

        return $dto;
    }
}
