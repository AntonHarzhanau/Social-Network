<?php

namespace App\Modules\SocialGraph\Domain\Repository;

use App\Modules\Shared\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use Symfony\Component\Uid\Uuid;

interface FriendshipRepositoryInterface
{
    public function save(Friendship $entity, bool $flush = true): void;
    public function remove(Friendship $entity, bool $flush = true): void;

    public function findFriendship(Uuid $userAId, Uuid $userBId, ?FriendshipStatusEnum $status = null): ?Friendship;

    /**
     * @return Friendship[]
     */
    public function findUserFriends(Uuid $user): array;

    /**
     * @return Friendship[]
     */
    public function findReceivedFriendRequests(Uuid $user): array;

    /**
     * @return Friendship[]
     */
    public function findSentFriendRequests(Uuid $user): array;
}
