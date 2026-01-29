<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\DTO\MemberRawDTO;
use App\Modules\Group\Application\DTO\MemberResponseDTO;
use App\Modules\Group\Application\DTO\MembersListResponseDTO;
use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;


final class GetMembersList
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {
    }

    public function execute(
        Uuid $groupId,
        ?string $status = null,
        Uuid $currentUserId,
        int $page,
        int $limit,
        string $query = '',
    ): MembersListResponseDTO {
        $group = $this->groupRepository->findById($groupId);
        if ($group === null) {
            throw new \RuntimeException('Group not found');
        }

        $currentUserMember = $this->groupMemberRepository->findOneByCriteria([
            'group' => $group,
            'user' => $currentUserId,
        ]);
        $currentUserRole = $currentUserMember?->getRole();
        
        $hasAccess = $currentUserRole && $currentUserRole !== GroupMemberRoleEnum::MEMBER;
        $enumStatus = GroupMemberStatusEnum::ACCEPTED;
        if ($status !== null && $hasAccess) {
            $enumStatus = GroupMemberStatusEnum::tryFrom($status);
            if ($enumStatus === null) {
                throw new \RuntimeException('Invalid status value');
            }
        } 

        $members = $this->groupMemberRepository->findGroupMembers($groupId, $enumStatus, null, $page, $limit, $query);
        $totalMembers = $this->groupMemberRepository->countGroupMembers($groupId, $enumStatus);

        $userIds = array_map(fn(MemberRawDTO $member) => $member->userId, $members);
        $userPreviews = $this->userDirectory->findPreviewsByIds($userIds);
        
        $userPreviewMap = [];
        foreach ($userPreviews as $userPreview) {
            $userPreviewMap[$userPreview->id] = $userPreview;
        }

        $items = [];
        foreach ($members as $member) {
            $items[] = new MemberResponseDTO(
                $member->id,
                $userPreviewMap[$member->userId] ?? null,
                $hasAccess ? $member->role->value : null,
                $hasAccess ? $member->status->value : null,
            );
        }
        
        return new MembersListResponseDTO(
            totalCount: $totalMembers,
            members: $items,
        );
    }
}
