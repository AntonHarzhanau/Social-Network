<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostFeedItem;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Application\Service\PostMediaBindingsService;
use App\Modules\Feed\Domain\Repository\WallPostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostByIdAction
{
    public function __construct(

        private readonly WallPostRepositoryInterface $wallPostRepository,
        private readonly PostMediaBindingsService $postMediaBindingsService,
        private readonly UserDirectoryInterface $userDirectory,
        private readonly PostFactory $postFactory,
    ) {}

    public function execute(Uuid $postId, User $currentUser): ?PostFeedItem
    {
        $row = $this->wallPostRepository->findPostsByIds($currentUser->getId(), $postId);

        $media = $this->postMediaBindingsService->getMediasForPosts([$postId]);
        $author = $this->userDirectory->findPreviewsByIds([$row->authorId]);
        $post = $this->postFactory->toPostResponse($row, $author[0] ?? null, $media[$postId->toRfc4122()] ?? []);
        return $post;
    }
}
