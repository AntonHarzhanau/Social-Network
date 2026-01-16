<?php

namespace App\Modules\Group\Api;

use App\Modules\Group\Application\Action\GetGroupPreviewsAction;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;

final class GroupApi implements GroupApiInterface
{
    public function __construct(
       private readonly GetGroupPreviewsAction $getGroupPreviewsAction, 
    ) {}
    
    /** @return GroupPreviewDTO[] */
    public function getGroupsPreviewsByWallIds(array $wallIds): array
    {
        return $this->getGroupPreviewsAction->execute($wallIds);
    }
}
