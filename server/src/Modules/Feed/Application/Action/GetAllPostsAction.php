<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetAllPostsAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly UserDirectoryInterface $userDirectory,
        private readonly PostFactory $postFactory,
    ) {}

    public function __invoke(int $page, int $limit, array $visibilities, Uuid $currentUserId): array
    {
        $user = $this->userDirectory->getUser($currentUserId->toRfc4122());

        $rows = $this->postRepository->findPosts(
            currentUser: $user,
            visibilities: $visibilities,
            page: $page,
            limit: $limit
        );

        $posts = $this->postFactory->toPostListResponse($rows);
        return $posts;
    }
}
