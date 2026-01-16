<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\DTO\GroupResponseDTO;
use App\Modules\Group\Application\Service\GroupResponseFactory;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetOneGroupAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupResponseFactory $groupResponseFactory,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $id): ?GroupResponseDTO
    {
        $group = $this->groupRepository->findById($currentUserId, $id);
        if (!$group) {
            return null;
        }
        $response = $this->groupResponseFactory->toListResponse([$group])[0];

        return $response;
    }
}
