<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Contracts\DTO\UserDetailsDTO;
use App\Modules\User\Domain\Exception\UserNotFoundException;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class GetUserProfileAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly UserMapper $mapper,
    ) {}

    public function execute(string $userId): UserDetailsDTO
    {   
        $user = $this->userRepository->findById($userId);

        if ($user === null || $user->getDeletedAt() !== null) {
            throw new UserNotFoundException();
        }
        return $this->mapper->toDetails($user);
    }
}
