<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\ReadModel\CommentView;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use Symfony\Component\Uid\Uuid;

final class GetCommentRepliesAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
    ) {}

    public function __invoke(Uuid $commentId, Uuid $currentUser, int $page, int $limit)
    {
        $parentComment = $this->commentRepository->findById($commentId);
        if ($parentComment === null) {
            throw new \InvalidArgumentException('Parent comment not found.');
        }

        $rows = $this->commentRepository->findReplies($parentComment, $currentUser, $page, $limit);

        $replies = [];
        foreach ($rows as $row) {
            $replies[] = new CommentView(
                id: $row['comment']->getId()->toRfc4122(),
                content: $row['comment']->getContent(),
                author: new UserPreviewDTO(
                    id: $row['comment']->getAuthor()->getId()->toRfc4122(),
                    username: $row['comment']->getAuthor()->getUsername(),
                    avatarUrl: $row['comment']->getAuthor()->getAvatarUrl(),
                    slug: $row['comment']->getAuthor()->getSlug(),
                ),
                createdAt: $row['comment']->getCreatedAt(),
                likeCount: $row['comment']->getLikeCount(),
                replyCount: $row['replyCount'],
                likedByCurrentUser: $row['likedByCurrentUser'],
            );
        }
        return $replies;
    }
}
