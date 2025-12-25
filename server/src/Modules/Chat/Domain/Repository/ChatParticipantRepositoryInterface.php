<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;

interface ChatParticipantRepositoryInterface
{
    public function findOneBy(array $criteria, array|null $orderBy = null): ?ChatParticipant;
    public function getAllUsersByChatId(Chat $chat): array;
    
}
