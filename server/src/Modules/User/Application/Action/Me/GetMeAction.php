<?php

namespace App\Modules\User\Application\Action\Me;

use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Contracts\DTO\UserDetailsDTO;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetMeAction
{
    public function __construct(
        private UserMapper $mapper,
        private UserRepositoryInterface $userRepository,
    ) {}
    
    public function execute(Uuid $userId): UserDetailsDTO
    {   
        $user = $this->userRepository->findById($userId->toRfc4122());
        if ($user === null || $user->getDeletedAt() !== null) {
            throw new \RuntimeException('User not found.');
        }   
        return $this->mapper->toDetails($user);
    }
}
