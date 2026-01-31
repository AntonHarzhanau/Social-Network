<?php

namespace App\Modules\User\Application\Action\Me;


use App\Modules\User\Contracts\DTO\UserPrivacySettingsDTO;
use App\Modules\User\Domain\Entity\User;

final class GetPrivacySettings
{
    public function __construct()
    {
    }

    public function execute(User $user): UserPrivacySettingsDTO
    {
        $privacySettings = $user->getPrivacySettings();

        return new UserPrivacySettingsDTO(
            postsVisibility: $privacySettings->getPostsVisibility()->value,
            mediaVisibility: $privacySettings->getMediaVisibility()->value,
            friendsVisibility: $privacySettings->getFriendsVisibility()->value,
            profileVisibility: $privacySettings->getProfileVisibility()->value,
            groupsVisibility: $privacySettings->getGroupsVisibility()->value,
        );
    }
}
