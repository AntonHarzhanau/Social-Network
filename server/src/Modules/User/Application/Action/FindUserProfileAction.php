<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Application\DTO\UserDetailsDTO;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Domain\Exception\UserNotFoundException;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class FindUserProfileAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly UserMapper $mapper,
    ) {}

    public function __invoke(string $userId): UserDetailsDTO
    {   
        $user = $this->userRepository->findOneById($userId);

        if ($user === null) {
            throw new UserNotFoundException();
        }
        return $this->mapper->toDetails($user);
    }
}
