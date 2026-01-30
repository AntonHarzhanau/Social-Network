<?php

namespace App\Modules\User\Application\Action\Me\Education;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use App\Modules\User\Infrastructure\Http\Request\UpdateEducationRequest;
use Symfony\Component\Uid\Uuid;

final class UpdateEducationAction
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {
    }

    public function execute(User $user, Uuid $educationId, UpdateEducationRequest $request): string 
    {
        $education = $this->educationRepository->findOneById($educationId);

        if (!$education) {
            throw new \LogicException('Education not found.');
        }

        if ($education->getUser()->getId() !== $user->getId()) {
            throw new \LogicException('You do not have permission to update this education.');
        }

        $education->setInstitutionName($request->institutionName);
        $education->setProgramName($request->programName);
        $education->setDegree($request->degree);
        $education->setStartAt(new \DateTimeImmutable($request->startAt));
        $education->setEndAt($request->endAt ? new \DateTimeImmutable($request->endAt) : null);

        $this->educationRepository->save($education);

        return $education->getId()->toRfc4122();
    }
}
