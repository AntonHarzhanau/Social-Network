<?php

namespace App\Modules\User\Application\Action\Me\Education;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\EducationRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteEducationAction
{
    public function __construct(
        private readonly EducationRepositoryInterface $educationRepository
    ) {
    }

    public function execute(User $user, Uuid $educationId): void
    {
        $education = $this->educationRepository->findOneById($educationId);
        if (!$education) {
            throw new \LogicException('Education not found.');
        }

        if ($education->getUser()->getId() !== $user->getId()) {
            throw new \LogicException('You do not have permission to delete this education.');
        }

        $this->educationRepository->delete($education);
    }
}
