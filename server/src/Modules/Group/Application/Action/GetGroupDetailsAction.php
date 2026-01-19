<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\DTO\GroupDetailResponseDTO;
use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetGroupDetailsAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {
    }

    public function execute(Uuid $currentUserId, Uuid $groupId): ?GroupDetailResponseDTO
    {

        $group = $this->groupRepository->findById($groupId);
        if (!$group) {
            throw new \RuntimeException('Group not found');
        }

        $avatar = null;
        $cover = null;
        if ($group->getCurrentAvatar() !== null) {
            $avatar = $this->mediaDirectory->getMediaItemsByIds([$group->getCurrentAvatar()])[$group->getCurrentAvatar()->getId()->toRfc4122()] ?? null;
        }

        if ($group->getCurrentCover() !== null) {
            $cover = $this->mediaDirectory->getMediaItemsByIds([$group->getCurrentCover()])[$group->getCurrentCover()->getId()->toRfc4122()] ?? null;
        }


        $member = $this->groupMemberRepository->findOneByCriteria([
            'group' => $groupId,
            'user' => $currentUserId,
        ]);

        $wallId = null;
        $description = null;

        if (($group->getVisibility() === GroupVisibilityEnum::PRIVATE && $member !== null) || $group->getVisibility() === GroupVisibilityEnum::PUBLIC) {
            $wallId = $group->getWall()?->getId();
            $description = $group->getDescription();
        }

        $response = new GroupDetailResponseDTO(
            id: $group->getId(),
            name: $group->getName(),
            groupVisibility: $group->getVisibility()->value,
            isMember: $member !== null,
            role: $member?->getRole()?->value ?? null,
            description: $description,
            subscribersCount: $group->getSubscribersCount(),
            wallId: $wallId,
            currentAvatar: $avatar,
            cover: $cover,
        );

        return $response;
    }
}
