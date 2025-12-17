<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class RemoveFriendAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
    ) {}

    public function execute(Uuid $userAId, Uuid $userBId): void
    {
        if ($userAId->equals($userBId)) {
            throw new \LogicException('Invalid friend id');
        }

        $friendship = $this->friendships->findFriendship($userAId, $userBId);

        if ($friendship === null) {
            throw new \LogicException('No existing friendship between these users.');
        }

        $this->friendships->remove($friendship);
    }
}
