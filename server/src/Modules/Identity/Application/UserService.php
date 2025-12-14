<?php

namespace App\Modules\Identity\Application;


use App\Factory\User\UserFactory;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Infrastructure\Persistence\Doctrine\Repository\UserRepository;

class UserService
{
    public function __construct(
        private readonly UserFactory $userFactory,
        private readonly UserRepository $userRepository,
    ) {}

    public function getAllUsersExemptCurrentUser($currentUser)
    {
        $data = $this->userRepository->findAllExeptUser($currentUser);
        $usersDTO = array_map(fn($user) => $this->userFactory->toUserResponseDTO($user), $data);
        return $usersDTO;
    }

    public function getUserById(string $id): ?User
    {
        $user = $this->userRepository->find($id);
        // $this->userFactory->toUserResponseDTO($user);
        return $user;
    }

    // TODO: change string $url to file upload handling
    public function addAvatar(User $user, string $url)
    {
        $user->setAvatarUrl($url);
        $this->userRepository->save($user, true);
        // $avatarUrl = $this->userRepository->addAvatarToUser($user, $id);
        return $url;
    }
}
