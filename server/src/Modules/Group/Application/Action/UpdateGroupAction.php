<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use App\Modules\Group\Infrastructure\Http\Request\UpdateGroupRequest;
use Symfony\Component\Uid\Uuid;

final class UpdateGroupAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
    ) {}

    public function execute(Uuid $groupId, Uuid $userId, UpdateGroupRequest $data): string
    {
        $group = $this->groupRepository->findById($groupId);

        if ($group === null) {
            throw new \DomainException('Group not found');
        }

        if (!$group->getOwner()->getId()->equals($userId)) {
            throw new \DomainException('Only group owner can update group');
        }

        if ($data->name !== null) {
            $group->setName($data->name);
        }
        if ($data->description !== null) {
            $group->setDescription($data->description);
        }
        if ($data->visibility !== null) {
            $group->setVisibility(GroupVisibilityEnum::from($data->visibility));
        }

        $this->groupRepository->save($group);

        return $group->getId()->toRfc4122();
    }
}
