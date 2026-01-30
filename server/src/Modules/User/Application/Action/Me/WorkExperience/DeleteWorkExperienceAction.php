<?php

namespace App\Modules\User\Application\Action\Me\WorkExperience;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\WorkExperienceRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteWorkExperienceAction
{
    public function __construct(
        private readonly WorkExperienceRepositoryInterface $workExperienceRepository,
    ) {
    }

    public function execute(User $user, Uuid $workExperience): void
    {
        $workExperience = $this->workExperienceRepository->findOneById($workExperience);
        if (!$workExperience) {
            throw new \LogicException('Work experience not found.');
        }

        if ($workExperience->getUser()->getId() !== $user->getId()) {
            throw new \LogicException('You do not have permission to delete this work experience.');
        }

        $this->workExperienceRepository->delete($workExperience);
    }
}
