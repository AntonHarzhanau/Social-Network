<?php

namespace App\Modules\User\Api;

use App\Modules\User\Application\Action\FindUserPreviewsByIdsAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class UserApi implements UserApiInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly FindUserPreviewsByIdsAction $findUserPreviewsByIdsAction,
    ) {}

    public function findById(string $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    /** @return list<User> */
    public function findManyByIds(array $ids): array 
    {
        return $this->userRepository->findBy(['id' => $ids]);
    }

    /** @return list<UserPreviewDTO> */
    public function findPreviewsByIds(array $ids): array
    {
        return $this->findUserPreviewsByIdsAction->execute($ids);
    }
}
