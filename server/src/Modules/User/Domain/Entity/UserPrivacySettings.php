<?php

namespace App\Modules\User\Domain\Entity;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Infrastructure\Persistence\Doctrine\Repository\UserPrivacySettingsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserPrivacySettingsRepository::class)]
class UserPrivacySettings
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\OneToOne(inversedBy: 'PrivacySettings', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $userId = null;

    #[ORM\Column(length: 255)]
    private ?string $postsVisibility = null;

    #[ORM\Column(length: 255)]
    private ?string $mediaVisibility = null;

    #[ORM\Column(length: 255)]
    private ?string $friendsVisibility = null;

    #[ORM\Column(length: 255)]
    private ?string $profileVisibility = null;

    #[ORM\Column(length: 255)]
    private ?string $groupsVisibility = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(User $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getPostsVisibility(): ?string
    {
        return $this->postsVisibility;
    }

    public function setPostsVisibility(string $postsVisibility): static
    {
        $this->postsVisibility = $postsVisibility;

        return $this;
    }

    public function getMediaVisibility(): ?string
    {
        return $this->mediaVisibility;
    }

    public function setMediaVisibility(string $mediaVisibility): static
    {
        $this->mediaVisibility = $mediaVisibility;

        return $this;
    }

    public function getFriendsVisibility(): ?string
    {
        return $this->friendsVisibility;
    }

    public function setFriendsVisibility(string $friendsVisibility): static
    {
        $this->friendsVisibility = $friendsVisibility;

        return $this;
    }

    public function getProfileVisibility(): ?string
    {
        return $this->profileVisibility;
    }

    public function setProfileVisibility(string $profileVisibility): static
    {
        $this->profileVisibility = $profileVisibility;

        return $this;
    }

    public function getGroupsVisibility(): ?string
    {
        return $this->groupsVisibility;
    }

    public function setGroupsVisibility(string $groupsVisibility): static
    {
        $this->groupsVisibility = $groupsVisibility;

        return $this;
    }
}
