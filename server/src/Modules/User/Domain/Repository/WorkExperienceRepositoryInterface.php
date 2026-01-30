<?php

namespace App\Modules\User\Domain\Repository;

use App\Modules\User\Domain\Entity\WorkExperience;
use Symfony\Component\Uid\Uuid;

interface WorkExperienceRepositoryInterface
{
    public function save(WorkExperience $workExperience, bool $flush = true): void;

    public function delete(WorkExperience $workExperience, bool $flush = true): void;
    public function findOneById(Uuid $id): ?WorkExperience;

    public function findAllByUserId(Uuid $userId): array;

    public function findCurrentOrLastForUser(Uuid $userId): ?WorkExperience;
}
