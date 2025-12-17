<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class AcceptFriendRequestAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private readonly UserDirectoryInterface $users,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $requesterId): void
    {
        $friendship = $this->friendships->findFriendship($currentUserId, $requesterId);

        if ($friendship === null 
        || $friendship->getAddressee()->getId() !== $currentUserId 
        || $friendship->getStatus() !== FriendshipStatusEnum::PENDING) {
            throw new PendingRequestNotFoundException();
        }

        $friendship->setStatus(FriendshipStatusEnum::ACCEPTED);
        $friendship->setUpdatedAt(new \DateTimeImmutable());

        $this->friendships->save($friendship);
    }
}
