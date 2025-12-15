<?php

namespace App\Modules\Identity\Domain\Repository;

use App\Modules\Identity\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function save(User $user, bool $flush = true): void;

    public function remove(User $user, bool $flush = true): void;
    
    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function findByUsername(string $username): ?User; 

    /** @return User[] */
    // public function getPreviewsByIds(array $ids): array;
    
    /** @return User[] */
    public function findAllExcept(User $excludedUser): array;

}
