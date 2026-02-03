<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\Media\Domain\Enum\FileTypeEnum;
use App\Modules\User\Application\Action\User\GetUserAvatarsAction;
use App\Modules\User\Application\Action\User\GetUserMediaFileAction;
use App\Modules\User\Application\Action\User\GetUserProfileAction;
use App\Modules\User\Application\Action\User\GetUserProfileDetailsAction;
use App\Modules\User\Application\Action\User\GetUsersAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Exception\UserNotFoundException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/users')]
final class UserController extends AbstractController
{
    public function __construct()
    {
    }

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

    #[Route('/{userId}/profile', methods: ['GET'])]
    public function getProfile(
        #[CurrentUser] ?User $currentUser,
        string $userId,
        GetUserProfileAction $action,
    ): JsonResponse {

        try {
            $user = $action->execute(Uuid::fromString($userId), $currentUser);
            return $this->json($user);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{userId}/profile/details', methods: ['GET'])]
    public function getProfileDetails(
        #[CurrentUser] ?User $currentUser,
        string $userId,
        GetUserProfileDetailsAction $action,
    ): JsonResponse {

        try {
            $user = $action->execute(Uuid::fromString($userId), $currentUser);
            return $this->json($user);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{userId}/avatars', methods: ['GET'])]
    public function getUserAvatars(
        string $userId,
        #[CurrentUser()] User $currentUser,
        GetUserAvatarsAction $action,
    ): JsonResponse {
        try {
            $avatars = $action->execute(Uuid::fromString($userId), $currentUser->getId());
            return $this->json($avatars, Response::HTTP_OK);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{userId}/media', methods: ['GET'])]
    public function getUserMedia(
        string $userId,
        #[CurrentUser()] User $currentUser,
        #[MapQueryParameter()] ?string $type,
        GetUserMediaFileAction $action,
    ): JsonResponse {

        $fileType = $type !== null ? FileTypeEnum::from($type) : FileTypeEnum::IMAGE;
        try {
            $media = $action->execute(Uuid::fromString($userId), $currentUser, $fileType);
            return $this->json($media, Response::HTTP_OK);
        } catch (UserNotFoundException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }
}

