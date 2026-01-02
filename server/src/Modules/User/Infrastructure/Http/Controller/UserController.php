<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\User\Application\Action\DeleteAccountAction;
use App\Modules\User\Application\Action\FindUserProfileAction;
use App\Modules\User\Application\Action\FindUsersAction;
use App\Modules\User\Application\Action\UpdateProfileAction;
use App\Modules\User\Application\Action\UpdateUserAvatarAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Exception\UserNotFoundException;
use App\Modules\User\Infrastructure\Http\Request\UpdateAvatarRequest;
use App\Modules\User\Infrastructure\Http\Request\UpdateProfileRequest;
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
        return $this->json($action($user));
    }

    #[Route('/profile', methods: ['PUT'])]
    public function updateProfile(
        #[CurrentUser] ?User $currentUser,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateProfileRequest $dto,
        UpdateProfileAction $action,
    ): JsonResponse {
        if (!$currentUser) return $this->json(['error' => 'Unauthorized'], 401);
        $action(
            $currentUser->getId(),
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

        try {
            $user = $action($userId);
            return $this->json($user);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }


    #[Route('/avatar', methods: ['POST'])]
    public function updateAvatar(
        #[CurrentUser] ?User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateAvatarRequest $dto,
        UpdateUserAvatarAction $action,
    ): JsonResponse {
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $action->execute($user->getId(), $dto->originalFileId, $dto->previewFileId);

        return $this->json(['ok' => true]);
    }

    #[Route('', methods: ['DELETE'])]
    public function deleteAccount(
        #[CurrentUser] ?User $user,
        DeleteAccountAction $action,
    ): JsonResponse {
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $action($user->getId());
        return $this->json(['ok' => true]);
    }
}
