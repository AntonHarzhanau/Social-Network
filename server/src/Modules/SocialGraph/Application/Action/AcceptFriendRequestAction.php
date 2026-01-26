<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\Shared\Application\Port\EventBusInterface;
use App\Modules\SocialGraph\Application\Event\FriendRequestAccepted;
use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class AcceptFriendRequestAction
{
    public function __construct(
        private readonly FriendshipRepositoryInterface $friendships,
        private EventBusInterface $events,
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

        $this->events->dispatch(new FriendRequestAccepted(
            $friendship->getId(),
            $requesterId,
            $currentUserId,
        ));
    }
}
