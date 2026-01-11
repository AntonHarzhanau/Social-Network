<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostsByAuthor
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly PostFactory $postFactory,
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
        $posts = $this->postFactory->toPostListResponse($currentUser->getId(), $rows);
        return $posts;
    }
}
