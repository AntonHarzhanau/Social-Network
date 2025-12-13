<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Enum\FriendshipsTypeEnum;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendRequestsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    /** @return User[] */
    public function execute(Uuid $currentUserId, FriendshipsTypeEnum $type): array
    {
        $currentUser = $this->users->getUserEntityOrFail($currentUserId);

        $friendships = match ($type) {
            FriendshipsTypeEnum::SENT => $this->friendships->findSentFriendRequests($currentUser),
            FriendshipsTypeEnum::RECEIVED => $this->friendships->findReceivedFriendRequests($currentUser),
            default => throw new \InvalidArgumentException('Invalid friendship type'),
        };

        return array_map(
            fn($friendship) => $type === FriendshipsTypeEnum::SENT
                ? $friendship->getAddressee()
                : $friendship->getRequester(),
            $friendships
        );
    }
}
