<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\DTO\GroupDetailResponseDTO;
use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
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

    public function execute(Uuid $currentUserId, Uuid $groupId): GroupDetailResponseDTO
    {
        $group = $this->groupRepository->findById($groupId);
        if (!$group) {
            throw new \RuntimeException('Group not found');
        }

        $member = $this->groupMemberRepository->findOneByCriteria([
            'group' => $groupId,
            'user' => $currentUserId,
        ]);

        $media = array_filter([$group->getCurrentAvatar(), $group->getCurrentCover()]);
        $mediaMap = $media ? $this->mediaDirectory->getMediaItemsByIds($media) : [];

        $avatar = null;
        if ($group->getCurrentAvatar() !== null) {
            $id = $group->getCurrentAvatar()->getId()->toRfc4122();
            $avatar = $mediaMap[$id] ?? null;
        }

        $cover = null;
        if ($group->getCurrentCover() !== null) {
            $id = $group->getCurrentCover()->getId()->toRfc4122();
            $cover = $mediaMap[$id] ?? null;
        }

        // 2) публичная часть — ВСЕГДА
        $description = $group->getDescription();

        // 3) приватная часть — по правилам
        $isBanned = $member?->getStatus() === GroupMemberStatusEnum::BANNED;

        $isAcceptedMember = $member !== null
            && $member->getStatus() === GroupMemberStatusEnum::ACCEPTED; // если нет ACCEPTED — замени на нужный “участник”

        $canSeeWall = !$isBanned && (
            $group->getVisibility() === GroupVisibilityEnum::PUBLIC
            || ($group->getVisibility() === GroupVisibilityEnum::PRIVATE && $isAcceptedMember)
        );

        $wallId = $canSeeWall ? $group->getWall()?->getId() : null;

        return new GroupDetailResponseDTO(
            id: $group->getId(),
            name: $group->getName(),
            groupVisibility: $group->getVisibility()->value,

            // isMember — обычно логичнее "принятый участник", а не "запись есть"
            isMember: $isAcceptedMember,

            role: $member?->getRole()?->value ?? null,
            status: $member?->getStatus()?->value ?? null,

            description: $description,
            subscribersCount: $group->getSubscribersCount(),

            wallId: $wallId,

            currentAvatar: $avatar,
            cover: $cover,
        );
    }
}
