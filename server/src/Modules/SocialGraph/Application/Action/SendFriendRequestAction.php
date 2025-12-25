<?php

namespace App\Modules\SocialGraph\Application\Action;

use App\Modules\Shared\Domain\Enum\FriendshipStatusEnum;
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

        $requester = $this->users->getUser($requesterId);
        $addressee = $this->users->getUser($addresseeId);

        if (!$requester || !$addressee) {
            throw new \InvalidArgumentException('Requester or addressee user not found');
        }

        if ($this->friendships->findFriendship($requesterId, $addresseeId) !== null) {
            throw new FriendshipAlreadyExistsException(); 
        }

        $friendship = new Friendship();
        $friendship->setRequester($requester);
        $friendship->setAddressee($addressee);
        $friendship->setStatus(FriendshipStatusEnum::PENDING);

        $this->friendships->save($friendship);
    }
}
