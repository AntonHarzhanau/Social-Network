<?php

namespace App\Modules\Identity\Infrastructure\Controller;

use App\Modules\Identity\Application\Action\FindUserProfileAction;
use App\Modules\Identity\Application\Action\FindUsersAction;
use App\Modules\Identity\Application\Action\UpdateProfileAction;
use App\Modules\Identity\Application\Action\UpdateUserAvatarAction;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Infrastructure\Http\Request\UpdateAvatarRequest;
use App\Modules\Identity\Infrastructure\Http\Request\UpdateProfileRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/users')]
final class UserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        #[CurrentUser] ?User $user,
        FindUsersAction $action,
    ): JsonResponse {
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);
        return $this->json($action($user));
    }

    #[Route('/profile', methods: ['PUT'])]
    public function updateProfile(
        #[CurrentUser] ?User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateProfileRequest $dto,
        UpdateProfileAction $action,
    ): JsonResponse {
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $action(
            $user,
            $dto->username,
            $dto->location,
            $dto->bio,
            $dto->coverUrl,
            $dto->maritalStatus
        );

        return $this->json(['ok' => true]);
    }

    #[Route('/{userId}/profile', methods: ['GET'])]
    public function getProfile(
        #[CurrentUser] ?User $currentUser,
        string $userId,
        FindUserProfileAction $action,
    ): JsonResponse {
        if (!$currentUser) return $this->json(['error' => 'Unauthorized'], 401);
        $user = $action($userId);

        if ($user) {
            return $this->json($user);
        }

        return $this->json(['error' => 'User not found'], 404);
    }


    #[Route('/avatar', methods: ['PUT'])]
    public function updateAvatar(
        #[CurrentUser] ?User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateAvatarRequest $dto,
        UpdateUserAvatarAction $action,
    ): JsonResponse {
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $action($user, $dto->avatarUrl);

        return $this->json(['ok' => true]);
    }
}
