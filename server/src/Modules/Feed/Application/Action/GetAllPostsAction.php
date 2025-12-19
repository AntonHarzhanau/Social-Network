<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Media\Application\Action\GetMediaDownLoadUrlAction;
use Symfony\Component\Uid\Uuid;

final class GetAllPostsAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function __invoke(int $page, int $limit, array $visibilities, Uuid $currentUserId): array
    {
        $user = $this->userDirectory->getUser($currentUserId->toRfc4122());

        $data = $this->postRepository->findPosts(
            currentUser: $user,
            visibilities: $visibilities,
            page: $page,
            limit: $limit
        );

        $postIds = array_map(fn(PostFeedItem $post) => $post->id, $data);
        $media = $this->mediaAssetDirectory->getBindingsByPostIds($postIds);
        $posts = [];
        foreach ($data as $post) {
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
