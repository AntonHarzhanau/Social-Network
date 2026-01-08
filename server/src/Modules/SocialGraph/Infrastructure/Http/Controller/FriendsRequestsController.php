<?php

namespace App\Modules\SocialGraph\Infrastructure\Http\Controller;

use App\Modules\SocialGraph\Domain\Enum\FriendshipsTypeEnum;
use App\Modules\User\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Action\AcceptFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\CancelFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\DeclineFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\ListFriendRequestsAction;
use App\Modules\SocialGraph\Application\Action\SendFriendRequestAction;
use App\Modules\SocialGraph\Infrastructure\Http\Request\FriendIdRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;
use ValueError;

#[Route('/api/friends-requests')]
final class FriendsRequestsController extends AbstractController
{
    public function __construct(
        private readonly SendFriendRequestAction $sendFriendRequest,
        private readonly ListFriendRequestsAction $listFriendRequests,
        private readonly AcceptFriendRequestAction $acceptFriendRequest,
        private readonly DeclineFriendRequestAction $declineFriendRequest,
        private readonly CancelFriendRequestAction $cancelFriendRequest,
    ) {}


    #[Route('', name: 'friends_send_request', methods: ['POST'], format: 'json')]
    public function send(
        #[CurrentUser] User $currentUser,
        #[MapRequestPayload] FriendIdRequest $req
    ): JsonResponse {
        try {
            $this->sendFriendRequest->execute($currentUser->getId(), Uuid::fromString($req->friendId));
        } catch (\Throwable $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json(['message' => 'Friend request sent'], JsonResponse::HTTP_OK);
    }


    #[Route('', name: 'friends_requests_list', methods: ['GET'], format: 'json')]
    public function list(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $typeStr = $request->query->get('type');
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);

        if (!$typeStr) {
            return $this->json(['error' => 'Type query parameter is required'], JsonResponse::HTTP_BAD_REQUEST);
        }
        try {
            $type = FriendshipsTypeEnum::from($typeStr);
        } catch (ValueError $e) {
            return $this->json(['error' => 'Invalid type parameter'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $previews = $this->listFriendRequests->execute($currentUser->getId(), $type, $page, $limit);

        return $this->json($previews, JsonResponse::HTTP_OK);
    }


    #[Route('/{requesterId}/accept', methods: ['POST'])]
    public function accept(#[CurrentUser] User $currentUser, string $requesterId): JsonResponse
    {
        $this->acceptFriendRequest->execute($currentUser->getId(), Uuid::fromString($requesterId));
        return $this->json(['message' => 'Friend request accepted'], JsonResponse::HTTP_OK);
    }


    #[Route('/{requesterId}/decline', methods: ['POST'])]
    public function decline(#[CurrentUser] User $currentUser, string $requesterId): JsonResponse
    {
        $this->declineFriendRequest->execute($currentUser->getId(), Uuid::fromString($requesterId));
        return $this->json(['message' => 'Friend request declined'], JsonResponse::HTTP_OK);
    }


    #[Route('/{addresseeId}', methods: ['DELETE'])]
    public function cancel(#[CurrentUser] User $currentUser, string $addresseeId): JsonResponse
    {
        try {
            $this->cancelFriendRequest->execute($currentUser->getId(), Uuid::fromString($addresseeId));
        } catch (\Throwable $e) {
            // TODO: change to proper error handling
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->json(['message' => 'Friend request canceled'], JsonResponse::HTTP_OK);
    }
}
