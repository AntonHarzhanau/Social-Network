<?php

namespace App\Modules\User\Application\Action\User;


use App\Modules\User\Application\Port\SocialGraphPort;
use App\Modules\User\Application\Service\ProfileAccessPolicy;
use App\Modules\User\Contracts\DTO\EducationPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPrivateProfileDetailsDTO;
use App\Modules\User\Contracts\DTO\WorkExperiencePreviewDTO;
use App\Modules\User\Domain\Entity\Education;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Entity\WorkExperience;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Domain\Repository\WorkExperienceRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

final class GetUserProfileDetailsAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private EducationRepositoryInterface $educations,
        private WorkExperienceRepositoryInterface $work,
        private ProfileAccessPolicy $policy,
        private SocialGraphPort $socialGraph,
    ) {
    }

    public function execute(Uuid $profileUserId, User $viewer): UserPrivateProfileDetailsDTO
    {
        $owner = $this->users->findById($profileUserId);

        $isBlocked = $this->socialGraph->isUserBlockedByUser($owner->getId(), $viewer->getId());
        $isFriend = $this->socialGraph->areUsersFriends($owner->getId(), $viewer->getId());
        $decision = $this->policy->decide($viewer, $owner, $isBlocked, $isFriend);

        if (!$decision->canViewMore) {
            throw new NotFoundHttpException();
        }

        $educations = array_map(
            fn(Education $e) => $this->mapEducationPreview($e),
            $this->educations->findAllByUserId($owner->getId())
        );

        $work = array_map(
            fn(WorkExperience $w) => $this->mapWorkPreview($w),
            $this->work->findAllByUserId($owner->getId())
        );

        return new UserPrivateProfileDetailsDTO(
            dateOfBirth: $owner->getDateOfBirth()->format('Y-m-d'),
            maritalStatus: $owner->getMaritalStatus()?->value ?? null,
            location: $owner->getLocation(),
            bio: $owner->getBio(),
            educations: $educations,
            workExperiences: $work,
        );
    }

    private function mapEducationPreview(Education $e): EducationPreviewDTO
    {
        return new EducationPreviewDTO(
            id: (string) $e->getId(),
            institutionName: $e->getInstitutionName(),
            programName: $e->getProgramName(),
            degree: $e->getDegree(),
            startAt: $e->getStartAt()->format('Y-m-d'),
            endAt: $e->getEndAt()?->format('Y-m-d'),
        );
    }
    private function mapWorkPreview(WorkExperience $w): WorkExperiencePreviewDTO
    {
        return new WorkExperiencePreviewDTO(
            id: (string) $w->getId(),
            company: $w->getCompany(),
            positionTitle: $w->getPositionTitle(),
            startAt: $w->getStartAt()->format('Y-m-d'),
            endAt: $w->getEndAt()?->format('Y-m-d')
        );
    }
}
