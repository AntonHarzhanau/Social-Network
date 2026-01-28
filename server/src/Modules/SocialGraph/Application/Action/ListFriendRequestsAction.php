<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\DTO\FriendListResponseDTO;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Enum\FriendCountMode;
use App\Modules\SocialGraph\Domain\Enum\FriendshipsTypeEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendRequestsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {
    }

    public function execute(Uuid $currentUserId, FriendshipsTypeEnum $type, int $page, int $limit, ?string $search = null): array
    {

        $ids = match ($type) {
            FriendshipsTypeEnum::SENT => $this->friendships->findSentFriendRequests($currentUserId, $page, $limit, $search),
            FriendshipsTypeEnum::RECEIVED => $this->friendships->findReceivedFriendRequests($currentUserId, $page, $limit, $search),
            default => throw new \InvalidArgumentException('Invalid friendship type'),
        };

        $previews = $this->users->findPreviewsByIds($ids);

        return $previews;
    }
}
