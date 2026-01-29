<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Entity\Group;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\Uid\Uuid;

final class CreateGroupAction
{
    public function __construct(
        private readonly UserApiInterface $userApi,
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
    ) {}

    public function execute(Uuid $creatorId, string $groupName, string $visibility): string 
    {
        $creator = $this->userApi->findById($creatorId);
        if (!$creator) {
            throw new \InvalidArgumentException('User not found.');
        }

        $group = (new Group())
            ->setName($groupName)
            ->setOwner($creator)
            ->setVisibility(GroupVisibilityEnum::from($visibility))
            ->setCreatedAt(new \DateTimeImmutable());
            
        $this->groupRepository->save($group, false);

        $newMember = (new GroupMember())
            ->setGroup($group)
            ->setUser($creator)
            ->setRole(GroupMemberRoleEnum::OWNER)
            ->setStatus(GroupMemberStatusEnum::ACCEPTED);


        $group->setSubscribersCount(1);

        $this->groupMemberRepository->save($newMember, true);
        return $group->getId()->toRfc4122();
    }
}
