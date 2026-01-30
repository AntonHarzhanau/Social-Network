<?php

namespace App\Modules\User\Contracts\DTO;

final readonly class UserPrivateProfileDetailsDTO
{
    /** @param list<EducationPreviewDTO> $educations
     *  @param list<WorkExperiencePreviewDTO> $workExperiences
     */
    public function __construct(
        public string $dateOfBirth,
        public ?string $maritalStatus,
        public ?string $location,
        public ?string $bio,
        public array $educations,
        public array $workExperiences,
    ) {}
}
