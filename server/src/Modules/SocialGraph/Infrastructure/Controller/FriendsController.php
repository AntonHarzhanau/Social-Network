<?php

namespace App\Modules\SocialGraph\Infrastructure\Controller;

use App\Entity\User;
use App\Factory\User\UserFactory;
use App\Modules\SocialGraph\Application\Action\ListFriendsAction;
use App\Modules\SocialGraph\Application\Action\RemoveFriendAction;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/friends')]
final class FriendsController extends AbstractController
{
    public function __construct(
        private readonly ListFriendsAction $listFriends,
        private readonly RemoveFriendAction $removeFriend,
        private readonly UserFactory $userFactory,
    ) {}

    #[Route('', name: 'friends_list', methods: ['GET'], format: 'json')]
    public function list(#[CurrentUser] User $currentUser): JsonResponse
    {
        $friends = $this->listFriends->execute($currentUser->getId());

        return $this->json($this->mapUsers($friends), JsonResponse::HTTP_OK, [], ['groups' => 'user:preview']);
    }


    #[Route('/{friendId}', name: 'friends_remove', methods: ['DELETE'], format: 'json')]
    public function deleteFriend(
        #[CurrentUser] User $currentUser,
        string $friendId,
    ): JsonResponse {

        $this->removeFriend->execute($currentUser->getId(), Uuid::fromString($friendId));

        return $this->json(['message' => 'Friend removed'], JsonResponse::HTTP_OK);
    }

    private function mapUsers(array $users): array
    {
        return array_map(fn(User $user) => $this->userFactory->toUserResponseDTO($user), $users);
    }
}
