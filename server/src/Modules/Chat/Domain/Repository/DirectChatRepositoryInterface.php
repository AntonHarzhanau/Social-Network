<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\DirectChat;
use Symfony\Component\Uid\Uuid;

interface DirectChatRepositoryInterface
{
    public function findByUsers(Uuid $userA, Uuid $userB): ?DirectChat;
    public function save(DirectChat $directChat): void;
}
