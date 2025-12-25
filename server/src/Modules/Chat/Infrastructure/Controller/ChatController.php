<?php

namespace App\Modules\Chat\Infrastructure\Controller;

use App\Modules\Chat\Application\Action\Chat\AddUserToChat;
use App\Modules\Chat\Application\Action\Chat\CreateGroupChat;
use App\Modules\Chat\Application\Action\Chat\GetChat;
use App\Modules\Chat\Application\Action\Chat\GetChatList;
use App\Modules\Chat\Application\Action\Chat\GetChatMessages;
use App\Modules\Chat\Infrastructure\Http\Request\CreateChatRequest;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/chats')]
final class ChatController extends AbstractController
{
    public function __construct() {}

    #[Route('', name: 'new_chat', methods: ['POST'], format: 'json')]
    public function createGroupChat(
        Request $request,
        #[CurrentUser] $currentUser,
        #[MapRequestPayload] CreateChatRequest $data,
        CreateGroupChat $createGroupChat
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $createGroupChat(
            $currentUser->getId(),
            $data['title'],
            $data['avatarUrl'] ?? null,
            $data['participantIds']
        );

        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
    }

    #[Route('', name: 'get_chats', methods: ['GET'], format: 'json')]
    public function getAll(
        #[CurrentUser] User $user,
        Request $request,
        GetChatList $getChatList,
    ): JsonResponse {

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));

        $dto = $getChatList($user->getId(), $page, $limit);

        return $this->json(
            $dto,
            JsonResponse::HTTP_OK,
            [],
            ['groups' => 'chat:list']
        );
    }


    #[Route('/{chatId}', name: 'get_chat', methods: ['GET'], format: 'json')]
    public function getOne(
        #[CurrentUser] User $user,
        string $chatId,
        GetChat $getChat
    ): JsonResponse {
        $dto = $getChat(Uuid::fromString($chatId), $user->getId());
        return $this->json(
            $dto,
            JsonResponse::HTTP_OK,
            [],
            ['groups' => 'chat:detail']
        );
    }

    #[Route('', name: 'update_chat', methods: ['PUT'], format: 'json')]
    public function update(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
    }

    #[Route('', name: 'delete_chat', methods: ['DELETE'], format: 'json')]
    public function delete(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
    }


    #[Route('/{chatId}/messages', name: 'get_chat_messages', methods: ['GET'], format: 'json')]
    public function getChatMessages(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        GetChatMessages $getChatMessages
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 30));

        $messages = $getChatMessages(Uuid::fromString($chatId), $currentUser->getId(), $page, $limit);
        return $this->json($messages, JsonResponse::HTTP_OK, [], ['groups' => 'message:list']);
    }

    #[Route('/{chatId}/add', name: 'add_user_to_chat', methods: ['POST'], format: 'json')]
    public function addUserToChat(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        AddUserToChat $addUserToChat
    ): JsonResponse {
        $ids = json_decode($request->getContent(), true);

        $addUserToChat($ids['newParticipantIds'], Uuid::fromString($chatId), $currentUser->getId());

       
        return $this->json(['message' => 'User(s) added to chat'], JsonResponse::HTTP_OK, [], ['groups' => 'message:list']);
    }
}
