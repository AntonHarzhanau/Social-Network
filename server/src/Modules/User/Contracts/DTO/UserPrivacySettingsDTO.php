<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPrivacySettingsDTO
{
    public function __construct(
        public string $postsVisibility,
        public string $mediaVisibility,
        public string $friendsVisibility,
        public string $profileVisibility,
        public string $groupsVisibility,
    ) {}
}
