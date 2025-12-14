<?php

namespace App\Modules\Chat\Domain\Repository;

interface ChatParticipantRepositoryInterface
{
    public function findOneBy(array $criteria, array|null $orderBy = null): object|null;
}
