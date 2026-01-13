<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetAllPostsAction
{
    public function __construct(
        private readonly PostFactory $postFactory,
        private readonly PostRepositoryInterface $postRepository, 
    ) {}

    public function execute(array $visibilities, Uuid $currentUserId, int $page, int $limit): array
    {

        $rows = $this->postRepository->findFeed(
            currentUser: $currentUserId,
            wallIds: null,
            page: $page,
            limit: $limit,
        );
        $posts = $this->postFactory->toPostListResponse($rows);
        return $posts;
    }
}
