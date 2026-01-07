<?php

namespace App\Modules\User\Application\Action;

use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class FindUsersAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private UserMapper $mapper,
        private SocialGraphApiInterface $socialGraphApi,
    ) {}

    /** @return list<UserPreviewDTO> */
    public function __invoke(User $currentUser, ?int $page = null, ?int $limit = null): array
    {
        $exceptUserIds = array_merge(
            [$currentUser->getId()],
            $this->socialGraphApi->getBlockedUsersIdsForUser($currentUser->getId())
        );
        $userFriendIds = $this->socialGraphApi->getFriendsIdsForUser($currentUser->getId());
 
        $exceptUserIds = array_merge($exceptUserIds, $userFriendIds);
        $items = $this->users->findAllExcept($exceptUserIds, $page, $limit);

        return array_map(
            fn(User $user) => $this->mapper->toPreview($user),
            $items
        );
    }
}
