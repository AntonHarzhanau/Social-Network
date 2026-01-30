<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserProfileResponseDTO
{
    public function __construct(
        public UserPublicProfileDTO $public,

        // null если нельзя смотреть
        public ?UserPrivateProfileSummaryDTO $privateSummary,

        // для UI
        public bool $canViewPrivateSummary,
        public bool $canViewMore,
    ) {}
}
