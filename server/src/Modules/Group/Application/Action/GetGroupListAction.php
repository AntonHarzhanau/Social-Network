<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Service\GroupResponseFactory;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetGroupListAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupResponseFactory $groupResponseFactory,
    ) {}

    public function execute(Uuid $currentUserId, int $page, int $limit, string $groupName, bool $forMe = false): array
    {
        // $groups = $this->groupRepository->findAllGroupsWithSubscribers($currentUserId, $page, $limit);
        $groups = $forMe
            ? $this->groupRepository->findAcceptedMemberGroups($currentUserId, $groupName, $page, $limit)
            : $this->groupRepository->findGroupsExceptAcceptedMember($currentUserId, $groupName, $page, $limit);
        // $groups = $this->groupRepository->findOwnedGroups($currentUserId, $groupName);

        $response = $this->groupResponseFactory->toListResponse($groups);

        return $response;
    }
}
