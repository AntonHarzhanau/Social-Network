<?php

namespace App\Modules\SocialGraph\Infrastructure\Controller;

use App\Enum\FriendshipsTypeEnum;
use App\Factory\User\UserFactory;
use App\Modules\User\Domain\Entity\User;
use App\Modules\SocialGraph\Application\Action\AcceptFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\CancelFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\DeclineFriendRequestAction;
use App\Modules\SocialGraph\Application\Action\ListFriendRequestsAction;
use App\Modules\SocialGraph\Application\Action\SendFriendRequestAction;
use App\Modules\SocialGraph\Infrastructure\Http\FriendIdRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/friends-requests')]
final class FriendsRequestsController extends AbstractController
{
    public function __construct(
        private readonly SendFriendRequestAction $sendFriendRequest,
        private readonly ListFriendRequestsAction $listFriendRequests,
        private readonly AcceptFriendRequestAction $acceptFriendRequest,
        private readonly DeclineFriendRequestAction $declineFriendRequest,
        private readonly CancelFriendRequestAction $cancelFriendRequest,
        private readonly UserFactory $userFactory,
    ) {}


    #[Route('', name: 'friends_send_request', methods: ['POST'], format: 'json')]
    public function send(
        #[CurrentUser] User $currentUser,
        #[MapRequestPayload] FriendIdRequest $req
    ): JsonResponse {
        $this->sendFriendRequest->execute($currentUser->getId(), Uuid::fromString($req->friendId));

        return $this->json(['message' => 'Friend request sent'], JsonResponse::HTTP_OK);
    }


    #[Route('', name: 'friends_requests_list', methods: ['GET'], format: 'json')]
    public function list(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $typeStr = $request->query->get('type');

        if (!$typeStr) {
            return $this->json(['error' => 'Type query parameter is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $type = FriendshipsTypeEnum::from($typeStr);

        $users = $this->listFriendRequests->execute($currentUser->getId(), $type);


        return $this->json($this->mapUsers($users), JsonResponse::HTTP_OK, [], ['groups' => 'user:preview']);
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
        $this->cancelFriendRequest->execute($currentUser->getId(), Uuid::fromString($addresseeId));
        return $this->json(['message' => 'Friend request canceled'], JsonResponse::HTTP_OK);
    }
    

    private function mapUsers(array $users): array
    {
        return array_map(fn(User $u) => $this->userFactory->toUserResponseDTO($u), $users);
    }
}
