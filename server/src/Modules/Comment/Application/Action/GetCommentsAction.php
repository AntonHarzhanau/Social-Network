<?php

namespace App\Modules\Comment\Application\Action;

use App\Modules\Comment\Application\DTO\CommentResponse;
use App\Modules\Comment\Application\Port\UserDirectoryInterface;
use App\Modules\Comment\Application\ReadModel\CommentView;
use App\Modules\Comment\Domain\Repository\CommentRepositoryInterface;
use App\Modules\Comment\Domain\Repository\CommentThreadRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetCommentsAction
{
    public function __construct(
        private readonly CommentRepositoryInterface $commentRepository,
        private readonly CommentThreadRepositoryInterface $commentThreadRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(Uuid $threadId, Uuid $currentUserId, int $page = 1, int $limit = 10): array
    {
        $thread = $this->commentThreadRepository->findThreadById($threadId);
        if ($thread === null) {
            throw new \InvalidArgumentException('Thread not found.');
        }

        $rows = $this->commentRepository->findByThreadId($threadId,  $currentUserId, $page, $limit);
        $authorsIds = array_values(array_unique(array_map(fn($row) => $row['comment']->getAuthor()->getId(), $rows)));
        $previewsRes = $this->userDirectory->findPreviewsByIds($authorsIds);
        $previews = [];
        foreach ($previewsRes as $preview) {
            $previews[$preview->id] = $preview;
        }

        $result = [];
        foreach ($rows as $row) {
            $authorId = $row['comment']->getAuthor()->getId()->toRfc4122();
            $result[] = new CommentResponse(
                id: $row['comment']->getId()->toRfc4122(),
                content: $row['comment']->getContent(),
                author: $previews[$authorId] ?? null,
                createdAt: $row['comment']->getCreatedAt(),
                likeCount: $row['comment']->getLikeCount(),
                replyCount: $row['replyCount'],
                likedByCurrentUser: $row['likedByCurrentUser'],
            );
        }
        return $result;
    }
}
