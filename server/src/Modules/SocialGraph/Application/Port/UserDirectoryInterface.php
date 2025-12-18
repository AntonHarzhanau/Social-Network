<?php

namespace App\Modules\SocialGraph\Application\Port;

use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

interface UserDirectoryInterface
{
    public function getUser(string $userId): ?User;
    
    /** @return list<UserPreview> */
    public function findPreviewsByIds(array $ids): array;
}
