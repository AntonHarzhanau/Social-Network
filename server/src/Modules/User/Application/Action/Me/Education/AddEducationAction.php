<?php

namespace App\Modules\User\Application\Action\Me\Education;

use App\Modules\User\Domain\Entity\Education;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use App\Modules\User\Infrastructure\Http\Request\CreateEducationRequest;

final class AddEducationAction
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {
    }

    public function execute(User $user, CreateEducationRequest $request): string 
    {
        $education = new Education($user);
        $education->setInstitutionName($request->institutionName);
        $education->setProgramName($request->programName);
        $education->setDegree($request->degree);
        $education->setStartAt(new \DateTimeImmutable($request->startAt));
        $education->setEndAt($request->endAt ? new \DateTimeImmutable($request->endAt) : null);

        $this->educationRepository->save($education);
        return $education->getId()->toRfc4122();
    }
}
