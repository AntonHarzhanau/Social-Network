<?php

namespace App\Modules\SocialGraph\Api;

use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Symfony\Component\Uid\Uuid;

class SocialGraphApi implements SocialGraphApiInterface
{
    public function __construct(
        private readonly UserBlockRepositoryInterface $userBlockRepository,
    ) {}

    /**
     * @return Uuid[]
     */
    public function getBlockedUsersIdsForUser(Uuid $currentUserId): array
    {

        return $this->userBlockRepository->getBlockedUserIdsForUser($currentUserId);
    }

    public function isUserBlockedByUser(Uuid $userId, Uuid $potentialBlockerId): bool
    {
        return $this->userBlockRepository->findOneByBlockerAndBlocked($userId, $potentialBlockerId) ? true : false;
    }
}
