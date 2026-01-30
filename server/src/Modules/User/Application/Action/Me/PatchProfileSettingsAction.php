<?php

namespace App\Modules\User\Application\Action\Me;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Enum\MaritalStatusEnum;
use App\Modules\User\Domain\Enum\ProfileVisibilityEnum;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Infrastructure\Http\Request\PatchProfileSettingsRequest;

final class PatchProfileSettingsAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function execute(User $user, PatchProfileSettingsRequest $req): void
    {
        $profile = $req->profile ?? [];
        $privacy = $req->privacy ?? [];

        // PROFILE
        if (\array_key_exists('username', $profile)) {
            $user->setUsername($profile['username']);
        }

        if (\array_key_exists('location', $profile)) {
            $user->setLocation($profile['location']);
        }

        if (\array_key_exists('bio', $profile)) {
            $user->setBio($profile['bio']);
        }

        if (\array_key_exists('maritalStatus', $profile)) {
            $user->setMaritalStatus(MaritalStatusEnum::from($profile['maritalStatus']));
        }

        if (\array_key_exists('dateOfBirth', $profile)) {
            $dob = \DateTimeImmutable::createFromFormat('Y-m-d', $profile['dateOfBirth']);
            if (!$dob) {
                throw new \DomainException('Invalid dateOfBirth');
            }
            $user->setDateOfBirth($dob);
        }

        // PRIVACY
        if (!empty($privacy)) {
            $ps = $user->getPrivacySettings();
            if (!$ps) {
                throw new \LogicException('User privacy settings are missing');
            }

            if (\array_key_exists('postsVisibility', $privacy)) {
                $ps->setPostsVisibility(ProfileVisibilityEnum::from($privacy['postsVisibility']));
            }
            if (\array_key_exists('mediaVisibility', $privacy)) {
                $ps->setMediaVisibility(ProfileVisibilityEnum::from($privacy['mediaVisibility']));
            }
            if (\array_key_exists('friendsVisibility', $privacy)) {
                $ps->setFriendsVisibility(ProfileVisibilityEnum::from($privacy['friendsVisibility']));
            }
            if (\array_key_exists('profileVisibility', $privacy)) {
                $ps->setProfileVisibility(ProfileVisibilityEnum::from($privacy['profileVisibility']));
            }
            if (\array_key_exists('groupsVisibility', $privacy)) {
                $ps->setGroupsVisibility(ProfileVisibilityEnum::from($privacy['groupsVisibility']));
            }
        }

        $this->users->save($user);
    }
}
