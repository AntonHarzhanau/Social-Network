<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostsByAuthor
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
    ) {}

    public function __invoke(
        User $currentUser,
        Uuid $authorId,
        int $page,
        int $limit
    ): array {
        $rows = $this->postRepository->findPosts(
            currentUser: $currentUser,
            authorId: $authorId,
            page: $page,
            limit: $limit
        );

        $postIds = array_map(fn(PostFeedItem $post) => $post->id, $rows);

        $media = $this->mediaAssetDirectory->getBindingsByPostIds($postIds);

        $posts = [];
        foreach ($rows as $post) {
            $postMedia = $media[$post->id] ?? [];
            $posts[] = new PostFeedItem(
                id: $post->id,
                content: $post->content,
                likeCount: $post->likeCount,
                commentCount: $post->commentCount,
                isLikedByCurrentUser: $post->isLikedByCurrentUser,
                date: $post->date,
                author: $post->author,
                media: $postMedia
            );
        }

        return $posts;
    }
}
