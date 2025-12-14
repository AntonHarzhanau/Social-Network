<?php

namespace App\Modules\Identity\Infrastructure\Controller;

use App\Factory\User\UserFactory;
use App\Modules\Identity\Application\UserService;
use App\Modules\Identity\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/user')]
final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly UserFactory $userFactory,
    ) {}

    #[Route('', name: 'get_users', methods: ['GET'], format: 'json')]
    public function getAll(#[CurrentUser] User $user): JsonResponse
    {
        $users = $this->userService->getAllUsersExemptCurrentUser($user);
        return $this->json($users, JsonResponse::HTTP_OK, [], ['groups' => 'user:preview']);
    }

    #[Route('/{id}', name: 'get_user', methods: ['GET'], format: 'json')]
    public function getOne(User $user): JsonResponse
    {
        $user = $this->userFactory->toUserResponseDTO($user);
        if (!$user) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        return $this->json($user, JsonResponse::HTTP_OK, [], ['groups' => 'user:preview']);
    }

      #[Route('/{id}/profile', name: 'get_profile', methods: ['GET'], format: 'json')]
    public function getProfile(User $user): JsonResponse
    {
        $user = $this->userFactory->toUserResponseDTO($user);
        if (!$user) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        return $this->json($user, JsonResponse::HTTP_OK, [], ['groups' => 'user:fullProfile']);
    }

    #[Route('/avatar/{id}', name: 'add_avatar', methods: ['POST'], format: 'json')]
    public function addAvatar(#[CurrentUser] User $user, string $url): JsonResponse
    {
        $avatarUrl = $this->userService->addAvatar($user, $url);
        if (!$avatarUrl) {
            return $this->json(['message' => 'Failed to add avatar'], JsonResponse::HTTP_BAD_REQUEST);
        }
        return $this->json(['avatarUrl' => $avatarUrl], JsonResponse::HTTP_OK);
    }
}
