<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostsByWallAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository, 
        private readonly PostFactory $postFactory,
    ) {}

    public function execute(
        User $currentUser,
        Uuid $wallId,
        int $page,
        int $limit
    ): array {
       $posts = $this->postRepository->findByWallId(
            currentUser: $currentUser->getId(),
            wallId: $wallId,
            page: $page,
            limit: $limit,
        );
        $posts = $this->postFactory->toPostListResponse($currentUser->getId(), $posts);
        return $posts;
    }
}
