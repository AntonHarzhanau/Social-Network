<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Service\GroupResponseFactory;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetAllGroupsAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupResponseFactory $groupResponseFactory,
    ) {}

    public function execute(Uuid $currentUserId, int $page, int $limit): array
    {
        $groups = $this->groupRepository->findAllGroupsWithSubscribers($currentUserId, $page, $limit);

        $response = $this->groupResponseFactory->toListResponse($groups);

        return $response;
    }
}
