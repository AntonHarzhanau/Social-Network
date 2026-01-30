<?php

namespace App\Modules\User\Domain\Entity;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Enum\ProfileVisibilityEnum;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
class UserPrivacySettings
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\OneToOne(inversedBy: 'privacySettings', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(enumType: ProfileVisibilityEnum::class)]
    private ProfileVisibilityEnum $postsVisibility = ProfileVisibilityEnum::PUBLIC;

    #[ORM\Column(enumType: ProfileVisibilityEnum::class)]
    private ProfileVisibilityEnum $mediaVisibility = ProfileVisibilityEnum::PUBLIC;

    #[ORM\Column(enumType: ProfileVisibilityEnum::class)]
    private ProfileVisibilityEnum $friendsVisibility = ProfileVisibilityEnum::PUBLIC;

    #[ORM\Column(enumType: ProfileVisibilityEnum::class)]
    private ProfileVisibilityEnum $profileVisibility = ProfileVisibilityEnum::PUBLIC;

    #[ORM\Column(enumType: ProfileVisibilityEnum::class)]
    private ProfileVisibilityEnum $groupsVisibility = ProfileVisibilityEnum::PUBLIC;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getPostsVisibility(): ProfileVisibilityEnum
    {
        return $this->postsVisibility;
    }

    public function setPostsVisibility(ProfileVisibilityEnum $postsVisibility): static
    {
        $this->postsVisibility = $postsVisibility;

        return $this;
    }

    public function getMediaVisibility(): ProfileVisibilityEnum
    {
        return $this->mediaVisibility;
    }

    public function setMediaVisibility(ProfileVisibilityEnum $mediaVisibility): static
    {
        $this->mediaVisibility = $mediaVisibility;

        return $this;
    }

    public function getFriendsVisibility(): ProfileVisibilityEnum
    {
        return $this->friendsVisibility;
    }

    public function setFriendsVisibility(ProfileVisibilityEnum $friendsVisibility): static
    {
        $this->friendsVisibility = $friendsVisibility;

        return $this;
    }

    public function getProfileVisibility(): ProfileVisibilityEnum
    {
        return $this->profileVisibility;
    }

    public function setProfileVisibility(ProfileVisibilityEnum $profileVisibility): static
    {
        $this->profileVisibility = $profileVisibility;

        return $this;
    }

    public function getGroupsVisibility(): ProfileVisibilityEnum
    {
        return $this->groupsVisibility;
    }

    public function setGroupsVisibility(ProfileVisibilityEnum $groupsVisibility): static
    {
        $this->groupsVisibility = $groupsVisibility;

        return $this;
    }
}
