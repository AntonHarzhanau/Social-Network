<?php

namespace App\Service\User;

use App\Entity\User;
use App\Factory\User\UserFactory;
use App\Repository\UserRepository;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserFactory $userFactory,
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
