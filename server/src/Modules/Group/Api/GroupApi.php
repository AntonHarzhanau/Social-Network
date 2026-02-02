<?php

namespace App\Modules\Group\Api;

use App\Modules\Group\Application\Action\GetGroupPreviewsByWallsAction;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GroupApi implements GroupApiInterface
{
    public function __construct(
       private readonly GetGroupPreviewsByWallsAction $getGroupPreviewsAction,
       private readonly GroupRepositoryInterface $groupRepository,
       private readonly GroupMemberRepositoryInterface $groupMemberRepository
    ) {}

    public function findGroupWallIdsByUserId(Uuid $userId): array
    {
        return $this->groupRepository->findWallIdsByUserId($userId);
    }
    
    /** @return GroupPreviewDTO[] */
    public function getGroupsPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array
    {
        return $this->getGroupPreviewsAction->execute($currentUserId, $wallIds);
    }

    public function getUserRole(Uuid $groupId, Uuid $userId): ?string
    {
        return $this->groupMemberRepository->findUserRoleInGroup($groupId, $userId)->value ?? null;
    }
}
