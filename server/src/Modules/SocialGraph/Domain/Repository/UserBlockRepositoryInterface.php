<?php

namespace App\Modules\SocialGraph\Domain\Repository;

use App\Modules\SocialGraph\Domain\Entity\UserBlock;
use Symfony\Component\Uid\Uuid;

interface UserBlockRepositoryInterface
{
    public function save(UserBlock $userBlock, bool $flush = true): Uuid;
    public function remove(UserBlock $userBlock, bool $flush = true): void;
    public function findAllBlocksByBlockerId(Uuid $blockerId, int $page, int $limit): array;
    public function findOneByBlockerAndBlocked(Uuid $blockerId, Uuid $blockedId): ?UserBlock;
    public function getBlockedUserIdsForUser(Uuid $blockerId): array;
}
