<?php

namespace App\Modules\SocialGraph\Infrastructure\Http\Controller;

use App\Modules\SocialGraph\Application\Action\Block\AddBlockUserAction;
use App\Modules\SocialGraph\Application\Action\Block\DeleteBlockUserAction;
use App\Modules\SocialGraph\Application\Action\Block\GetBlackListAction;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/user-block')]
final class UserBlockController extends AbstractController
{
    public function __construct() {}

    #[Route('', name: 'user_block_list', methods: ['GET'], format: 'json')]
    public function list(
        Request $request,
        #[CurrentUser()] User $currentUser,
        GetBlackListAction $getBlackListAction,
    ): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', '1'));
        $limit = min(10, max(1, (int) $request->query->get('limit', '10')));

        $blacklist = $getBlackListAction->execute($currentUser->getId(), $page, $limit);
        return $this->json($blacklist, JsonResponse::HTTP_OK);
    }

    #[Route('/{userId}', name: 'user_block_add', methods: ['POST'], format: 'json')]
    public function add(
        string $userId,
        #[CurrentUser()] User $currentUser,
        AddBlockUserAction $blockUserAction,
    ): JsonResponse {
        try {
            $blockUserAction->execute(Uuid::fromString($userId), $currentUser->getId());
        } catch (\Throwable $th) {
            return $this->json(['error' => $th->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
        return $this->json(['message' => 'User blocked successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/{userId}', name: 'user_block_delete', methods: ['DELETE'], format: 'json')]
    public function delete(
        string $userId,
        #[CurrentUser()] User $currentUser,
        DeleteBlockUserAction $deleteBlockUserAction,
    ): JsonResponse {
        try {
            $deleteBlockUserAction->execute(Uuid::fromString($userId), $currentUser->getId());
        } catch (\Throwable $th) {
            return $this->json(['error' => $th->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
        return $this->json(['message' => 'User unblocked successfully'], JsonResponse::HTTP_OK);
    }
}
