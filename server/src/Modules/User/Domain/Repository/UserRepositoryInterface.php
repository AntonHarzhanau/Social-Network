<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function save(User $user, bool $flush = true): void;

    public function delete(User $user, bool $flush = true): void;
    
    public function findBy(array $criteria, ?array $orderBy = null, ?int $limit = null, ?int $offset = null): array;

    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User; 
    
    /** @return User[] */
    public function findAllExcept(User $excludedUser): array;

    /** @return UserPreviewDTO[] */
    public function findPreviewsByIds(array $ids): array;
}
