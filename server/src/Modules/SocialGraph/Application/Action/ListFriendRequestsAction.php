<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Enum\FriendshipsTypeEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendRequestsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    /** @return UserPreview[] */
    public function execute(Uuid $currentUserId, FriendshipsTypeEnum $type, int $page, int $limit): array
    {

        $ids = match ($type) {
            FriendshipsTypeEnum::SENT => $this->friendships->findSentFriendRequests($currentUserId, $page, $limit),
            FriendshipsTypeEnum::RECEIVED => $this->friendships->findReceivedFriendRequests($currentUserId, $page, $limit),
            default => throw new \InvalidArgumentException('Invalid friendship type'),
        };

        $previews = $this->users->findPreviewsByIds($ids);

        return $previews;
    }
}
