<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeclineFriendRequestAction
{
    public function __construct(
        public readonly FriendshipRepositoryInterface $friendships,
        public readonly UserDirectoryInterface $users,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $requesterId): void
    {
        $currentUser = $this->users->getUserEntityOrFail($currentUserId);
        $requesterUser = $this->users->getUserEntityOrFail($requesterId);

        $friendship = $this->friendships->findFriendship($currentUser, $requesterUser);

        if ($friendship === null || $friendship->getAddressee() !== $currentUser) {
            throw new PendingRequestNotFoundException(); 
        }

        $friendship->setStatus(FriendshipStatusEnum::DECLINED);
        $friendship->setUpdatedAt(new \DateTimeImmutable());

        $this->friendships->save($friendship);
    }
}
