<?php

namespace App\Modules\SocialGraph\Domain\Repository;

use App\Modules\SocialGraph\Domain\Enum\FriendCountMode;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use Symfony\Component\Uid\Uuid;

interface FriendshipRepositoryInterface
{
    public function save(Friendship $entity, bool $flush = true): void;
    public function remove(Friendship $entity, bool $flush = true): void;

    public function findFriendship(Uuid $userAId, Uuid $userBId, ?array $status = null, ?int $page = null, ?int $limit = null): ?Friendship;

    /**
     * @return Friendship[]
     */
    public function findUserFriends(Uuid $user, ?int $page = null, ?int $limit = null, ?string $search = null): array;

    /**
     * @return Friendship[]
     */
    public function findReceivedFriendRequests(Uuid $user, ?int $page = null, ?int $limit = null, ?string $search = null): array;

    /**
     * @return Friendship[]
     */
    public function findSentFriendRequests(Uuid $user, ?int $page = null, ?int $limit = null, ?string $search = null): array;

    public function countUserFriends(Uuid $userId, FriendCountMode $mode = FriendCountMode::FRIENDS): int;

    public function findFriendsWallIds(Uuid $userId): array;

}
