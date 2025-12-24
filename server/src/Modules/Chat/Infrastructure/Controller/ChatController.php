<?php

namespace App\Modules\Chat\Infrastructure\Controller;

use App\Modules\Chat\Application\Action\Chat\CreateGroupChat;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Application\ChatService;
use App\Modules\Chat\Application\ReadModel\Chat\ChatFactory;
use App\Modules\Chat\Infrastructure\Http\Request\CreateChatRequest;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/chats')]
final class ChatController extends AbstractController
{
    public function __construct(
        private readonly ChatService $chatService,
        private readonly ChatFactory $chatFactory,
    ) {}

    #[Route('', name: 'new_chat', methods: ['POST'], format: 'json')]
    public function createGroupChat(
        Request $request, 
        #[CurrentUser] $currentUser,
        #[MapRequestPayload] CreateChatRequest $data,
        CreateGroupChat $createGroupChat
    ): JsonResponse
    {
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
    public function getAll(#[CurrentUser] User $user, Request $request): JsonResponse
    {

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));
        
        $dto = $this->chatService->getChatList($user, $page, $limit);

        return $this->json(
            $dto,
            JsonResponse::HTTP_OK,
            [],
            ['groups' => 'chat:list']
        );
    }


    #[Route('/{id}', name: 'get_chat', methods: ['GET'], format: 'json')]
    public function getOne(#[CurrentUser] User $user, Chat $chat): JsonResponse
    {
        if (!$chat->getChatParticipants()->exists(function ($key, ChatParticipant $participant) use ($user) {
            return $participant->getUser()->getId() === $user->getId();
        })) {
            return $this->json(['error' => 'Access denied to this chat'], JsonResponse::HTTP_FORBIDDEN);
        }

        $dto = $this->chatFactory->toChatResponseDTO($chat, $user);
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


    #[Route('/{id}/messages', name: 'get_chat_messages', methods: ['GET'], format: 'json')]
    public function getChatMessages(
        Chat $chat, 
        #[CurrentUser] User $currentUser, 
        Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 30));

        $messages = $this->chatService->getMessagesByChat($chat, $currentUser, $page, $limit);
        return $this->json($messages, JsonResponse::HTTP_OK, [], ['groups' => 'message:list']);
    }

}
