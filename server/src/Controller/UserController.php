<?php

namespace App\Controller;

use App\Entity\User;
use App\Factory\User\UserFactory;
use App\Service\UserService;
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
    )
    {
    }

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
}
