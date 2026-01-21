<?php

namespace App\Modules\Group\Api;

use App\Modules\Group\Application\Action\GetGroupPreviewsByWallsAction;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GroupApi implements GroupApiInterface
{
    public function __construct(
       private readonly GetGroupPreviewsByWallsAction $getGroupPreviewsAction, 
    ) {}
    
    /** @return GroupPreviewDTO[] */
    public function getGroupsPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array
    {
        return $this->getGroupPreviewsAction->execute($currentUserId, $wallIds);
    }
}
