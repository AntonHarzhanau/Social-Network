<?php

namespace App\Modules\Group\Domain\Entity;

use App\Modules\Feed\Domain\Entity\Wall;
use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use App\Modules\User\Domain\Entity\User;
use App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository\GroupRepository;
use App\Modules\Media\Domain\Entity\MediaAsset;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: GroupRepository::class)]
#[ORM\Table(name: '`group`')]
class Group
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column(length: 100)]
    private ?string $name = null;

    #[ORM\Column(length: 120, nullable: true)]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\OneToOne(targetEntity: MediaAsset::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(name: 'current_avatar_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?MediaAsset $currentAvatar = null;

    #[ORM\OneToOne(targetEntity: MediaAsset::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(name: 'current_cover_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?MediaAsset $currentCover = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    private ?int $subscribersCount = 0;

    #[ORM\OneToOne(targetEntity: Wall::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(name: 'wall_id', referencedColumnName: 'id', nullable: false, unique: true, onDelete: 'CASCADE')]
    private ?Wall $wall = null;

    #[ORM\Column(enumType: GroupVisibilityEnum::class, length: 10)]
    private ?GroupVisibilityEnum $visibility = GroupVisibilityEnum::PUBLIC;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->wall = new Wall('group');
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $deletedAt): static
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getCurrentAvatar(): ?MediaAsset
    {
        return $this->currentAvatar;
    }

    public function setCurrentAvatar(?MediaAsset $currentAvatar): static
    {
        $this->currentAvatar = $currentAvatar;

        return $this;
    }

    public function getSubscribersCount(): ?int
    {
        return $this->subscribersCount;
    }

    public function setSubscribersCount(int $subscribersCount): static
    {
        $this->subscribersCount = $subscribersCount;

        return $this;
    }

    public function getCurrentCover(): ?MediaAsset
    {
        return $this->currentCover;
    }

    public function setCurrentCover(?MediaAsset $currentCover): static
    {
        $this->currentCover = $currentCover;

        return $this;
    }

    public function getWall(): Wall
    {
        return $this->wall;
    }

    public function setWall(Wall $wall): static
    {
        $this->wall = $wall;
        return $this;
    }

    public function getVisibility(): ?GroupVisibilityEnum
    {
        return $this->visibility;
    }

    public function setVisibility(GroupVisibilityEnum $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }
}
