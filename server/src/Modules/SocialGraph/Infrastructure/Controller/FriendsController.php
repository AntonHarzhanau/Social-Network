<?php

namespace App\Modules\SocialGraph\Infrastructure\Controller;

use App\Entity\User;
use App\Enum\FriendshipsTypeEnum;
use App\Factory\User\UserFactory;
use App\Modules\SocialGraph\Application\FriendshipService;
use App\Service\User\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/friends')]
final class FriendsController extends AbstractController
{

    public function __construct(
        private readonly UserService $userService,
        private readonly FriendshipService $friendshipService,
        private readonly UserFactory $userFactory,
    ) {}

    #[Route('', name: 'add_friend', methods: ['POST'], format: 'json')]
    public function addFriend(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $friendId = $payload['friendId'] ?? null;

        if (!$friendId) {
            return $this->json(['message' => 'Friend ID is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($friendId === $currentUser->getId()->toRfc4122()) {
            return $this->json(['message' => 'You cannot add yourself as a friend'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!$this->userService->getUserById($friendId)) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->friendshipService->friendshipRequest($currentUser, $this->userService->getUserById($friendId));

        return $this->json(['message' => 'Friend request sent'], JsonResponse::HTTP_OK);
    }


    #[Route('', name: 'get_friends', methods: ['GET'], format: 'json')]
    public function getFriends(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $queryParams = $request->query->get('type');
        $type = $queryParams ? FriendshipsTypeEnum::from($queryParams) : FriendshipsTypeEnum::ALL;

        $type === FriendshipsTypeEnum::ALL
            ? $friends = $this->friendshipService->getFriendships($currentUser)
            : $friends = $this->friendshipService->getFriendshipsRequests($currentUser, $type);

        $dto = array_map(
            fn(User $user) => $this->userFactory->toUserResponseDTO($user),
            $friends
        );

        return $this->json($dto, JsonResponse::HTTP_OK, [], ['groups' => 'user:preview']);
    }

    #[Route('', name: 'delete_friend', methods: ['DELETE'], format: 'json')]
    public function deleteFriend(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $friendId = json_decode($request->getContent(), true)['friendId'] ?? null;
        if (!$friendId) {
            return $this->json(['message' => 'Friend ID is required'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $friend = $this->userService->getUserById($friendId);
        if (!$friend) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->friendshipService->deleteFriend($currentUser, $friend);

        return $this->json(['message' => 'Friend removed'], JsonResponse::HTTP_OK);
    }

    #[Route('/accept', name: 'accept_friend_request', methods: ['POST'], format: 'json')]
    public function accept(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $friendId = json_decode($request->getContent(), true)['friendId'] ?? null;
        if (!$friendId) {
            return $this->json(['message' => 'Friend ID is required'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $requester = $this->userService->getUserById($friendId);
        if (!$requester) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->friendshipService->acceptFriendshipRequest($currentUser, $requester);

        return $this->json(['message' => 'Friend request accepted'], JsonResponse::HTTP_OK);
    }

    #[Route('/decline', name: 'decline_friend_request', methods: ['POST'], format: 'json')]
    public function decline(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $friendId = json_decode($request->getContent(), true)['friendId'] ?? null;
        if (!$friendId) {
            return $this->json(['message' => 'Friend ID is required'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $requester = $this->userService->getUserById($friendId);
        if (!$requester) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->friendshipService->declineFriendshipRequest($currentUser, $requester);

        return $this->json(['message' => 'Friend request declined'], JsonResponse::HTTP_OK);
    }

    #[Route('/cancel', name: 'cancel_friend_request', methods: ['POST'], format: 'json')]
    public function cancel(#[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $friendId = json_decode($request->getContent(), true)['friendId'] ?? null;
        if (!$friendId) {
            return $this->json(['message' => 'Friend ID is required'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $addressee = $this->userService->getUserById($friendId);
        if (!$addressee) {
            return $this->json(['message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->friendshipService->cancelFriendshipRequest($currentUser, $addressee);
        return $this->json(['message' => 'Friend request canceled'], JsonResponse::HTTP_OK);
    }
}
