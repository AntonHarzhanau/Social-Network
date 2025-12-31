<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;

final class GetAllGroupsAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
    ) {}

    public function execute(int $page, int $limit): array
    {
        $groups = $this->groupRepository->findAllGroups($page, $limit);
        
        $result = [];
        foreach ($groups as $group) {
            $result[] = [
                'id' => $group->getId()->toRfc4122(),
                'name' => $group->getName(),           
            ];
        }

       return $result;
    }
}
