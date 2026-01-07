<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function save(User $user, bool $flush = true): void;

    public function delete(User $user, bool $flush = true): void;
    
    /** @return User[] */
    public function findBy(array $criteria, ?array $orderBy = null, ?int $limit = null, ?int $offset = null): array;

    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User; 
    
    /**
     * @param array<Uuid> $excludedUsers
     * @return User[] */
    public function findAllExcept(array $excludedUsers, ?int $page = null, ?int $limit = null): array;

    /** @return UserPreviewDTO[] */
    public function findPreviewsByIds(array $ids): array;

    /** @return User|null */
    public function findOneBy(array $criteria, ?array $orderBy = null): ?object;
    
}
