<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class GetUsersAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private UserMapper $mapper,
        private SocialGraphApiInterface $socialGraphApi,
    ) {}

    /** @return list<UserPreviewDTO> */
    public function execute(User $currentUser, ?int $page = null, ?int $limit = null, ?string $query = null): array
    {
        $exceptUserIds = array_merge(
            [$currentUser->getId()],
            $this->socialGraphApi->getBlockedUsersIdsForUser($currentUser->getId())
        );
        $userFriendIds = $this->socialGraphApi->getFriendsIdsForUser($currentUser->getId());
 
        $exceptUserIds = array_merge($exceptUserIds, $userFriendIds);
        
        $items = $this->users->findAllExcept($exceptUserIds, $page, $limit, $query);

        return array_map(
            fn(User $user) => $this->mapper->toPreview($user),
            $items
        );
    }
}
