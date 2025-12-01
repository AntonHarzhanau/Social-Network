<?php

namespace App\Controller;

use App\DTO\Auth\RegisterUserDTO;
use App\Entity\User;
use App\Factory\User\UserFactory;
use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    #[Route('/register', name: 'app_auth_register', methods: ['POST'], format: 'json')]
    public function register(#[MapRequestPayload] ?RegisterUserDTO $dto): JsonResponse
    {
        if ($dto === null) {
            return new JsonResponse(['message' => 'Invalid input.'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $this->authService->register($dto);
        return new JsonResponse(['message' => 'User registered successfully.'], JsonResponse::HTTP_CREATED);
    }

    
    #[Route('/me', name: 'app_auth_me', methods: ['GET'], format: 'json')]
    public function me(
        UserFactory $userFactory,
        #[CurrentUser] User $user,
    ): JsonResponse {
        $meUserDTO = $userFactory->toAuthorSummaryDTO($user);
        return $this->json($meUserDTO, JsonResponse::HTTP_OK);
    }
}
