<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Application\DTO\UserDetailsDTO;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetMeAction
{
    public function __construct(
        private UserMapper $mapper,
        private UserRepositoryInterface $userRepository,
    ) {}
    
    public function __invoke(Uuid $userId): UserDetailsDTO
    {   
        $user = $this->userRepository->findOneById($userId);    
        return $this->mapper->toDetails($user);
    }
}
