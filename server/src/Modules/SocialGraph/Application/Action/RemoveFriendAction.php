<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class RemoveFriendAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    public function execute(Uuid $userAId, Uuid $userBId): void
    {
        if ($userAId->equals($userBId)) {
            throw new \LogicException('Invalid friend id');
        }

        $userA = $this->users->getUserEntityOrFail($userAId);
        $userB = $this->users->getUserEntityOrFail($userBId);

        $friendship = $this->friendships->findFriendship($userA, $userB);

        if ($friendship === null) {
            throw new \LogicException('No existing friendship between these users.');
        }

        $this->friendships->remove($friendship);
    }
}
