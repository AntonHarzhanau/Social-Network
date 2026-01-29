<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Service\GroupResponseFactory;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;
use function PHPUnit\Framework\matches;

final class GetGroupListAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupResponseFactory $groupResponseFactory,
    ) {}

    public function execute(Uuid $currentUserId, int $page, int $limit, ?string $groupName = null,  $filter = ''): array
    {
        $groups = match($filter) {
            'owned' => $this->groupRepository->findOwnedGroups($currentUserId, $groupName, $page, $limit),
            'subscribed' => $this->groupRepository->findAcceptedMemberGroups($currentUserId, $groupName, $page, $limit),
            "all" => $this->groupRepository->findAllGroups($currentUserId, $groupName, $page, $limit),
            default => $this->groupRepository->findAllGroups($currentUserId, $groupName, $page, $limit),
        };


        $response = $this->groupResponseFactory->toListResponse($groups);

        return $response;
    }
}
