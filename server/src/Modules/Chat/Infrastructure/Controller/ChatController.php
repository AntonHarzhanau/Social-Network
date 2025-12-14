<?php

namespace App\Modules\Chat\Infrastructure\Controller;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Factory\Chat\ChatFactory;
use App\Modules\Chat\Application\ChatService;
use App\Modules\Chat\Application\DirectChatService;
use App\Modules\Chat\Application\MessageService;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Infrastructure\Persistence\Doctrine\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/chats')]
final class ChatController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly ChatService $chatService,
        private readonly EntityManagerInterface $em,
        private readonly ChatFactory $chatFactory,
    ) {}

    #[Route('', name: 'new_chat', methods: ['POST'], format: 'json')]
    public function create(Request $request, #[CurrentUser] $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


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
    public function get(#[CurrentUser] User $user, Chat $chat): JsonResponse
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

    #[Route('/direct', name: 'send_first_direct_message', methods: ['POST'], format: 'json')]
    public function sendFirstDirectMessage(
        Request $request,
        #[CurrentUser] $currentUser,
        DirectChatService $directChatService,
        MessageService $messageService,

    ): JsonResponse {
        $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $id = $data['participantId'] ?? null;
        $content = trim($data['content'] ?? '');
        if (!$id || $content === '') {
            return $this->json(['error' => 'Participant ID and content are required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $otherUser = $this->userRepository->find($id);
        if (!$otherUser) {
            return $this->json(['error' => 'Participant not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $chat = $directChatService->getOrCreateDirectChat($currentUser, $otherUser);

        $message = $messageService->createMessage($chat, $currentUser, $content);
        $chat->setLastMessage($message);
        $this->em->persist($chat);
        $this->em->flush();

        return $this->json([
            'id' => $chat->getId(),
            'type' => $chat->getType(),
            'messageId' => $message->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
        ], JsonResponse::HTTP_CREATED);
    }


    #[Route('/{id}/messages', name: 'get_chat_messages', methods: ['GET'], format: 'json')]
    public function getChatMessages(Chat $chat, #[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 30));

        $messages = $this->chatService->getMessagesByChat($chat, $currentUser, $page, $limit);
        return $this->json($messages, JsonResponse::HTTP_OK, [], ['groups' => 'message:list']);
    }

    #[Route('/{id}/send', name: 'send_chat_message', methods: ['POST'], format: 'json')]
    public function sendChatMessage(
        Chat $chat,
        Request $request,
        #[CurrentUser] User $currentUser,
        MessageService $messageService,
    ): JsonResponse {
        if (!$chat->getChatParticipants()->exists(function ($key, ChatParticipant $participant) use ($currentUser) {
            return $participant->getUser()->getId() === $currentUser->getId();
        })) {
            return $this->json(['error' => 'Access denied to this chat'], JsonResponse::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $content = trim($data['content'] ?? '');
        if ($content === '') {
            return $this->json(['error' => 'Message content cannot be empty'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $message = $messageService->createMessage($chat, $currentUser, $content);
        $chat->setLastMessage($message);
        $this->em->persist($chat);
        $this->em->flush();

        return $this->json($message, JsonResponse::HTTP_CREATED, [], ['groups' => 'message:detail']);
    }
}
