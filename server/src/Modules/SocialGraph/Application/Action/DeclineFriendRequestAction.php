<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeclineFriendRequestAction
{
    public function __construct(
        public readonly FriendshipRepositoryInterface $friendships,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $requesterId): void
    {

        $friendship = $this->friendships->findFriendship($currentUserId, $requesterId);

        if ($friendship === null 
        || $friendship->getAddressee()->getId() !== $currentUserId 
        || $friendship->getStatus() !== FriendshipStatusEnum::PENDING) {
            throw new PendingRequestNotFoundException(); 
        }

        $this->friendships->remove($friendship);
    }
}
