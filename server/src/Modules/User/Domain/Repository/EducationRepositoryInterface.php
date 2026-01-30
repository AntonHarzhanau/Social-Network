<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\Education;
use Symfony\Component\Uid\Uuid;

interface EducationRepositoryInterface
{
    public function save(Education $education, bool $flush = true): void;

    public function delete(Education $education, bool $flush = true): void;

    public function findOneById(Uuid $id): ?Education;

    public function findAllByUserId(Uuid $userId): array;

    public function findCurrentOrLastForUser(Uuid $userId): ?Education;
}
