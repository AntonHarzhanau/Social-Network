<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\User\Application\Port\SocialGraphPort;
use App\Modules\User\Application\Service\PresenceService;
use App\Modules\User\Application\Service\ProfileAccessPolicy;
use App\Modules\User\Contracts\DTO\EducationPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPrivateProfileSummaryDTO;
use App\Modules\User\Contracts\DTO\UserProfileResponseDTO;
use App\Modules\User\Contracts\DTO\UserPublicProfileDTO;
use App\Modules\User\Contracts\DTO\WorkExperiencePreviewDTO;
use App\Modules\User\Domain\Entity\Education;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Entity\WorkExperience;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Domain\Repository\WorkExperienceRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetUserProfileAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private EducationRepositoryInterface $educations,
        private WorkExperienceRepositoryInterface $work,
        private ProfileAccessPolicy $policy,
        private SocialGraphPort $socialGraph,
        private PresenceService $presenceService,
        private GetMediaUrl $getUrl,
    ) {
    }

    public function execute(Uuid $profileUserId, User $viewer): UserProfileResponseDTO
    {
        $owner = $this->users->findById($profileUserId);

        $avatarUrl = $owner->getCurrentAvatar()
            ? ($this->getUrl)($owner->getCurrentAvatar()->getPreview()->getStorageKey())
            : null;

        $isBlocked = $this->socialGraph->isUserBlockedByUser($owner->getId(), $viewer->getId());
        $isFriend = $this->socialGraph->areUsersFriends($owner->getId(), $viewer->getId());

        $decision = $this->policy->decide($viewer, $owner, $isBlocked, $isFriend);

        $public = new UserPublicProfileDTO(
            id: (string) $owner->getId(),
            name: $owner->getUsername(),
            slug: $owner->getSlug(),
            avatarUrl: $avatarUrl,
            coverUrl: $owner->getCoverUrl(),
            isOnline: $this->presenceService->isUserOnline($owner->getLastLoginAt()),
        );

        $summary = null;
        if ($decision->canViewPrivateSummary) {
            $edu = $this->educations->findCurrentOrLastForUser($owner->getId());
            $job = $this->work->findCurrentOrLastForUser($owner->getId());

            $summary = new UserPrivateProfileSummaryDTO(
                location: $owner->getLocation(),
                wallId: $owner->getWall()->getId()->toRfc4122(),
                currentEducation: $edu ? $this->mapEducationPreview($edu) : null,
                currentWorkExperience: $job ? $this->mapWorkPreview($job) : null,
            );
        }

        return new UserProfileResponseDTO(
            public: $public,
            privateSummary: $summary,
            canViewPrivateSummary: $decision->canViewPrivateSummary,
            canViewMore: $decision->canViewMore,
        );
    }

    private function mapEducationPreview(Education $e): EducationPreviewDTO
    {
        return new EducationPreviewDTO(
            id: (string) $e->getId(),
            institutionName: $e->getInstitutionName(),
            programName: $e->getProgramName(),
            degree: $e->getDegree(),
            startAt: $e->getStartAt()->format('Y-m'),
            endAt: $e->getEndAt()?->format('Y-m'),
        );
    }
    private function mapWorkPreview(WorkExperience $w): WorkExperiencePreviewDTO
    { 
        return new WorkExperiencePreviewDTO(
            id: (string) $w->getId(),
            company: $w->getCompany(),
            positionTitle: $w->getPositionTitle(),
            startAt: $w->getStartAt()->format('Y-m'),
            endAt: $w->getEndAt()?->format('Y-m')
        );
    }
}

