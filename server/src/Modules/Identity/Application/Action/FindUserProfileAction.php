<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Application\DTO\UserDetailsDTO;
use App\Modules\Identity\Application\Mapper\UserMapper;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;

final class FindUserProfileAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly UserMapper $mapper,
    ) {}

    public function __invoke(string $userId): UserDetailsDTO
    {
        $user = $this->users->findById($userId);

        return $this->mapper->toDetails($user);
    }
}
