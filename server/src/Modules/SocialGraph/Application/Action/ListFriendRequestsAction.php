<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Enum\FriendshipsTypeEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ListFriendRequestsAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
    ) {}

    /** @return User[] */
    public function execute(Uuid $currentUserId, FriendshipsTypeEnum $type): array
    {

        $friendships = match ($type) {
            FriendshipsTypeEnum::SENT => $this->friendships->findSentFriendRequests($currentUserId),
            FriendshipsTypeEnum::RECEIVED => $this->friendships->findReceivedFriendRequests($currentUserId),
            default => throw new \InvalidArgumentException('Invalid friendship type'),
        };
        return $friendships;
    }
}
