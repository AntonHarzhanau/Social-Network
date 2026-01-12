<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Repository\WallPostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetAllPostsAction
{
    public function __construct(
        private readonly PostFactory $postFactory,
        private readonly WallPostRepositoryInterface $wallPostRepository,
    ) {}

    public function execute(array $visibilities, Uuid $currentUserId, int $page, int $limit): array
    {

        $rows = $this->wallPostRepository->findMixedFeed(
            currentUser: $currentUserId,
            wallIds: [],
            page: $page,
            limit: $limit,
            includePublicAlso: true
        );

        $posts = $this->postFactory->toPostListResponse($rows);
        return $posts;
    }
}
