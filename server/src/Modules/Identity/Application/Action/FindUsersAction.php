<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Application\Mapper\UserMapper;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class FindUsersAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private UserMapper $mapper,
    ) {}

    /** @return list<UserPreviewDTO> */
    public function __invoke(User $currentUser): array
    {
        $items = $this->users->findAllExcept($currentUser);
        return array_map(
            fn(User $user) => $this->mapper->toPreview($user),
            $items
        );
    }
}
