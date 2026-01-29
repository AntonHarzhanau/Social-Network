<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Port\FriendsDirectoryInterface;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetAllPostsAction
{
    public function __construct(
        private readonly PostFactory $postFactory,
        private readonly PostRepositoryInterface $postRepository,
        private readonly GroupDirectoryInterface $groupDirectory,
        private readonly FriendsDirectoryInterface $friendsDirectory,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(array $visibilities, Uuid $currentUserId, int $page, int $limit): array
    {
        $currentUser = $this->userDirectory->findPreviewsByIds([$currentUserId])[0];

        $curentUserWallId = $currentUser->wallId;
        $groupWallIds = $this->groupDirectory->findGroupWallIdsByUserId($currentUserId);
        $friendWallIds = $this->friendsDirectory->findFriendWallIdsByUserId($currentUserId);

        $wallIds = array_merge($groupWallIds, $friendWallIds, [$curentUserWallId]);
        $rows = $this->postRepository->findFeed(
            currentUser: $currentUserId,
            wallIds: $wallIds,
            page: $page,
            limit: $limit,
        );
        $posts = $this->postFactory->toPostListResponse($currentUserId, $rows);
        return $posts;
    }
}
