<?php

namespace App\Modules\SocialGraph\Infrastructure\Http\Controller;

use App\Modules\User\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Action\ListFriendsAction;
use App\Modules\SocialGraph\Application\Action\RemoveFriendAction;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/friends')]
final class FriendsController extends AbstractController
{
    public function __construct(
        private readonly ListFriendsAction $listFriends,
        private readonly RemoveFriendAction $removeFriend,
    ) {}

    #[Route('/{userId}', name: 'friends_list', methods: ['GET'], format: 'json')]
    public function list(
        string $userId,
        Request $request,
    ): JsonResponse {

        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $previews = $this->listFriends->execute(Uuid::fromString($userId), $page, $limit);


        return $this->json($previews, JsonResponse::HTTP_OK);
    }


    #[Route('/{friendId}', name: 'friends_remove', methods: ['DELETE'], format: 'json')]
    public function deleteFriend(
        #[CurrentUser] User $currentUser,
        string $friendId,
    ): JsonResponse {

        try {
            $this->removeFriend->execute($currentUser->getId(), Uuid::fromString($friendId));
        } catch (\Throwable $th) {
            return $this->json(['error' => $th->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['message' => 'Friend removed'], JsonResponse::HTTP_OK);
    }
}
