<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\FriendsDirectoryInterface;
use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use Symfony\Component\Uid\Uuid;

final class FriendsRepositoryAdapter implements FriendsDirectoryInterface
{
    public function __construct(
        private readonly SocialGraphApiInterface $socialGraphApi,
    ) {
    }

    public function findFriendWallIdsByUserId(Uuid $userId): array
    {
        return $this->socialGraphApi->getFriendsWallIdsForUser($userId);
    }


}
