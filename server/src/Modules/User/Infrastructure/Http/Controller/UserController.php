<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\User\Application\Action\User\DeleteAccountAction;
use App\Modules\User\Application\Action\User\GetUserAvatarsAction;
use App\Modules\User\Application\Action\User\GetUserProfileAction;
use App\Modules\User\Application\Action\User\GetUsersAction;
use App\Modules\User\Application\Action\User\UpdateProfileAction;
use App\Modules\User\Application\Action\User\UpdateUserAvatarAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Exception\UserNotFoundException;
use App\Modules\User\Infrastructure\Http\Request\UpdateAvatarRequest;
use App\Modules\User\Infrastructure\Http\Request\UpdateProfileRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/users')]
final class UserController extends AbstractController
{
    public function __construct() {}

    #[Route('', methods: ['GET'])]
    public function list(
        #[CurrentUser] ?User $user,
        Request $request,
        GetUsersAction $action,
    ): JsonResponse {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $username = trim((string) $request->query->get('username', ''));
        $username = $username !== '' ? $username : null;

        return $this->json($action->execute($user, $page, $limit, $username));
    }

    #[Route('/profile', methods: ['PUT'])]
    public function updateProfile(
        #[CurrentUser] ?User $currentUser,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateProfileRequest $dto,
        UpdateProfileAction $action,
    ): JsonResponse {
        if (!$currentUser) return $this->json(['error' => 'Unauthorized'], 401);
        $action->execute(
            $currentUser->getId(),
            $dto->username,
            $dto->location,
            $dto->bio,
            // $dto->coverUrl,
            $dto->maritalStatus
        );

        return $this->json(['ok' => true]);
    }

    #[Route('/{userId}/profile', methods: ['GET'])]
    public function getProfile(
        #[CurrentUser] ?User $currentUser,
        string $userId,
        GetUserProfileAction $action,
    ): JsonResponse {

        try {
            $user = $action->execute($userId);
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

        $action->execute($user->getId());
        return $this->json(['ok' => true]);
    }

    #[Route('/{userId}/avatars', methods: ['GET'])]
    public function getUserAvatars(
        string $userId,
        #[CurrentUser()] ?User $currentUser,
        GetUserAvatarsAction $action,
    ): JsonResponse {
        try {
            $avatars = $action->execute(Uuid::fromString($userId), $currentUser->getId());
            return $this->json($avatars, JsonResponse::HTTP_OK);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
