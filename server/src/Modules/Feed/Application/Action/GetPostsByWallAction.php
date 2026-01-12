<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\WallPostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostsByWallAction
{
    public function __construct(
        private readonly WallPostRepositoryInterface $wallPostRepository,
        private readonly PostFactory $postFactory,
    ) {}

    public function execute(
        User $currentUser,
        Uuid $wallId,
        int $page,
        int $limit
    ): array {
       $posts = $this->wallPostRepository->findWallFeed(
            currentUser: $currentUser->getId(),
            wallId: $wallId,
            page: $page,
            limit: $limit,
        );
        $posts = $this->postFactory->toPostListResponse($posts);
        return $posts;
    }
}
