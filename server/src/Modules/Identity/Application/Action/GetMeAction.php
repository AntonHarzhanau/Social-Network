<?php

namespace App\Modules\Identity\Application\Action;

use App\Modules\Identity\Application\DTO\UserDetailsDTO;
use App\Modules\Identity\Application\Mapper\UserMapper;
use App\Modules\Identity\Domain\Entity\User;

final class GetMeAction
{
    public function __construct(private UserMapper $mapper) {}
    
    public function __invoke(User $user): UserDetailsDTO
    {
        return $this->mapper->toDetails($user);
    }
}
