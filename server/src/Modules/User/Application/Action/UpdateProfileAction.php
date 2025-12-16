<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class UpdateProfileAction
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    public function __invoke(
        Uuid $userId,
        ?string $username = null,
        ?string $location = null,
        ?string $bio = null,
        ?string $coverUrl = null,
        ?string $maritalStatus = null,
    ): void {
        $user = $this->userRepository->findOneById($userId->toRfc4122());
        if ($username !== null) $user->setUsername($username);
        if ($location !== null) $user->setLocation($location);
        if ($bio !== null) $user->setBio($bio);
        if ($coverUrl !== null) $user->setCoverUrl($coverUrl);
        if ($maritalStatus !== null) $user->setMaritalStatus($maritalStatus);

        $this->userRepository->updateUser($user);
    }
}
