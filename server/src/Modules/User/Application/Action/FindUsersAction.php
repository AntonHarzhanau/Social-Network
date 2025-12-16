<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class FindUsersAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private UserMapper $mapper,
    ) {}

    /** @return list<UserPreviewDTO> */
    public function __invoke(Uuid $currentUserId): array
    {
        $items = $this->users->findAllExcept($currentUserId);
        return array_map(
            fn(User $user) => $this->mapper->toPreview($user),
            $items
        );
    }
}
