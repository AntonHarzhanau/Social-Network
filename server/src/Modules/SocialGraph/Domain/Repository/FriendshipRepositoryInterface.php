<?php

namespace App\Modules\SocialGraph\Domain\Repository;

use App\Enum\FriendshipStatusEnum;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\SocialGraph\Domain\Entity\Friendship;

interface FriendshipRepositoryInterface
{
    public function save(Friendship $entity, bool $flush = true): void;
    public function remove(Friendship $entity, bool $flush = true): void;

    public function findFriendship(User $userA, User $userB, ?FriendshipStatusEnum $status = null): ?Friendship;

    /**
     * @return Friendship[]
     */
    public function findUserFriends(User $user): array;

    /**
     * @return Friendship[]
     */
    public function findReceivedFriendRequests(User $user): array;

    /**
     * @return Friendship[]
     */
    public function findSentFriendRequests(User $user): array;
}
