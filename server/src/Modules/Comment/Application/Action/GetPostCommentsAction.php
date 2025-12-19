<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\ReadModel\CommentView;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use Symfony\Component\Uid\Uuid;

final class GetPostCommentsAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(Uuid $postId, Uuid $currentUserId, int $page = 1, int $limit = 10): array
    {
        $post = $this->postRepository->findOneById($postId);
        if ($post === null) {
            throw new \InvalidArgumentException('Post not found.');
        }

        $rows = $this->commentRepository->findRootForPost($postId,  $currentUserId, $page, $limit);

        $result = [];
        foreach ($rows as $row) {
            $result[] = new CommentView(
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
        return $result;
    }
}
