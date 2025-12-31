<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Entity\Group;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetOneGroupAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
    ) {}

    public function execute(Uuid $id): ?Group
    {
        $group = $this->groupRepository->findById($id);
        
        $result = [
            'id' => $group->getId()->toRfc4122(),
            'name' => $group->getName(),
                'description' => $group->getDescription(),         
        ];

        return $group;
    }
}
