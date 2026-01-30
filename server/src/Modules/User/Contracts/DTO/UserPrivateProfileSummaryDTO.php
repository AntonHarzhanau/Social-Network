<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPrivateProfileSummaryDTO
{
    public function __construct(
        public ?string $location,
        public ?EducationPreviewDTO $currentEducation,
        public ?WorkExperiencePreviewDTO $currentWorkExperience,
    ) {}
}
