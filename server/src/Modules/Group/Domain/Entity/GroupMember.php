<?php

namespace App\Modules\Group\Domain\Entity;

use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository\GroupMemberRepository;
use App\Modules\User\Domain\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;


#[ORM\Entity(repositoryClass: GroupMemberRepository::class)]
#[ORM\UniqueConstraint(
    name: 'uniq_group_member_user_per_group',
    columns: ['user_id', 'group_id']
)]
class GroupMember
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, name: 'user_id')]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, name: 'group_id', onDelete: 'CASCADE')]
    private ?Group $group = null;

    #[ORM\Column(length: 255, enumType: GroupMemberRoleEnum::class)]
    private ?GroupMemberRoleEnum $role = null;

    #[ORM\Column(length: 255, enumType: GroupMemberStatusEnum::class)]
    private ?GroupMemberStatusEnum $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $joinedAt = null;

    public function __construct()
    {
        $this->joinedAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getGroup(): ?Group
    {
        return $this->group;
    }

    public function setGroup(?Group $group): static
    {
        $this->group = $group;

        return $this;
    }

    public function getRole(): ?GroupMemberRoleEnum
    {
        return $this->role;
    }

    public function setRole(?GroupMemberRoleEnum $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getJoinedAt(): ?\DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTimeImmutable $joinedAt): static
    {
        $this->joinedAt = $joinedAt;

        return $this;
    }

    public function getStatus(): ?GroupMemberStatusEnum
    {
        return $this->status;
    }

    public function setStatus(?GroupMemberStatusEnum $status): static
    {
        $this->status = $status;

        return $this;
    }
}
