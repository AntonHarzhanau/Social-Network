<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class CancelFriendRequestAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $addresseeId): void
    {
        $currentUser = $this->users->getUserEntityOrFail($currentUserId);
        $addressee = $this->users->getUserEntityOrFail($addresseeId);

        $friendship = $this->friendships->findFriendship($currentUser, $addressee);

        if ($friendship === null || $friendship->getRequester() !== $currentUser) {
            throw new PendingRequestNotFoundException(); 
        }

        $this->friendships->remove($friendship);
    }
}
