<?php

namespace App\Modules\User\Application\Action\Me\WorkExperience;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\WorkExperienceRepositoryInterface;
use App\Modules\User\Infrastructure\Http\Request\UpdateWorkExperienceRequest;
use Symfony\Component\Uid\Uuid;

final class UpdateWorkExperienceAction
{
    public function __construct(
        private readonly WorkExperienceRepositoryInterface $workExperienceRepository,
    ) {
    }

    public function execute(User $user, Uuid $workExperience, UpdateWorkExperienceRequest $request): string
    {
        $workExperience = $this->workExperienceRepository->findOneById($workExperience);
        if (!$workExperience) {
            throw new \LogicException('Work experience not found.');
        }

        if ($workExperience->getUser()->getId() !== $user->getId()) {
            throw new \LogicException('You do not have permission to update this work experience.');
        }

        $workExperience->setCompany($request->company);
        $workExperience->setPositionTitle($request->positionTitle);
        $workExperience->setStartAt(new \DateTimeImmutable($request->startAt));
        $workExperience->setEndAt($request->endAt ? new \DateTimeImmutable($request->endAt) : null);

        $this->workExperienceRepository->save($workExperience);

        return $workExperience->getId()->toRfc4122();
    }
}
