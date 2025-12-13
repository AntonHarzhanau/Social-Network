<?php

namespace App\Modules\SocialGraph\Application;

use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Entity\User;
use App\Enum\FriendshipStatusEnum;
use App\Enum\FriendshipsTypeEnum;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepository;

class FriendshipService
{
    public function __construct(
        private readonly FriendshipRepository $friendshipRepository,
    ) {}

    public function getFriendshipsRequests(User $currentUser, FriendshipsTypeEnum $type): array
    {
        $friendships = match ($type) {
            FriendshipsTypeEnum::SENT => $this->friendshipRepository->findSentRequests($currentUser),
            FriendshipsTypeEnum::RECEIVED => $this->friendshipRepository->findReceivedRequests($currentUser),
        };

        $friends = array_map(
            fn(Friendship $f) =>
            $type === FriendshipsTypeEnum::SENT
                ? $f->getAddressee()
                : $f->getRequester(),
            $friendships
        );
        return $friends;
    }

    public function getFriendships(User $currentUser): array
    {
        $friendships = $this->friendshipRepository->findUserFriends($currentUser);

        $friends = array_map(
            fn(Friendship $f) =>
            $f->getRequester() === $currentUser
                ? $f->getAddressee()
                : $f->getRequester(),
            $friendships
        );

        return $friends;
    }


    public function friendshipRequest(User $requester, User $addressee): void
    {
        if ($this->friendshipRepository->findFriendship($requester, $addressee) !== null) {

            throw new \LogicException('Friendship request already exists between these users.');
        }

        $friendship = new Friendship();
        $friendship->setRequester($requester);
        $friendship->setAddressee($addressee);
        $friendship->setStatus(FriendshipStatusEnum::PENDING);
        $friendship->setCreatedAt(new \DateTimeImmutable());

        $this->friendshipRepository->save($friendship);
    }

    public function acceptFriendshipRequest(User $currentUser, User $requester): void
    {
        $friendship = $this->friendshipRepository->findFriendship($currentUser, $requester, FriendshipStatusEnum::PENDING);

        if ($friendship === null || $friendship->getAddressee() !== $currentUser) {
            throw new \LogicException('No pending friendship request from this user.');
        }

        $friendship->setStatus(FriendshipStatusEnum::ACCEPTED);
        $this->friendshipRepository->save($friendship);
    }

    public function declineFriendshipRequest(User $currentUser, User $requester): void
    {
        $friendship = $this->friendshipRepository->findFriendship($currentUser, $requester, FriendshipStatusEnum::PENDING);

        if ($friendship === null || $friendship->getAddressee() !== $currentUser) {
            throw new \LogicException('No pending friendship request from this user.');
        }

        $friendship->setStatus(FriendshipStatusEnum::DECLINED);
        $this->friendshipRepository->save($friendship);
    }

    public function cancelFriendshipRequest(User $currentUser, User $addressee): void
    {
        $friendship = $this->friendshipRepository->findFriendship($currentUser, $addressee, FriendshipStatusEnum::PENDING);

        if ($friendship === null || $friendship->getRequester() !== $currentUser) {
            throw new \LogicException('No pending friendship request to this user.');
        }

        $this->friendshipRepository->remove($friendship);
    }

    public function deleteFriend(User $userA, User $userB): void
    {
        $friendship = $this->friendshipRepository->findFriendship($userA, $userB);

        if ($friendship === null) {
            throw new \LogicException('No existing friendship between these users.');
        }

        $friendship->setStatus(FriendshipStatusEnum::PENDING);
        $this->friendshipRepository->save($friendship);
    }
}
