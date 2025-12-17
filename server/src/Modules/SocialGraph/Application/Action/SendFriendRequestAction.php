<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Application\Exception\CannotFriendYourselfException;
use App\Modules\SocialGraph\Application\Exception\FriendshipAlreadyExistsException;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class SendFriendRequestAction
{
    public function __construct(
        private FriendshipRepositoryInterface $friendships,
        private UserDirectoryInterface $users,
    ) {}

    public function execute(Uuid $requesterId, Uuid $addresseeId): void
    {
        if ($requesterId->equals($addresseeId)) {
           throw new CannotFriendYourselfException(); 
        }

        $requester = $this->users->getUserEntityOrFail($requesterId);
        $addressee = $this->users->getUserEntityOrFail($addresseeId);

        if ($this->friendships->findFriendship($requesterId, $addresseeId) !== null) {
            throw new FriendshipAlreadyExistsException(); 
        }

        $friendship = new Friendship();
        $friendship->setRequester($requester);
        $friendship->setAddressee($addressee);
        $friendship->setStatus(FriendshipStatusEnum::PENDING);
        $friendship->setCreatedAt(new \DateTimeImmutable());

        $this->friendships->save($friendship);
    }
}
