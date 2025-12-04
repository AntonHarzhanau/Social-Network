<?php

namespace App\Controller;

use App\DTO\Chat\CreateDirectChatDTO;
use App\Entity\Chat;
use App\Entity\ChatParticipant;
use App\Entity\User;
use App\Enum\ChatParticipantRoleEnum;
use App\Enum\ChatTypeEnum;
use App\Repository\ChatRepository;
use App\Repository\UserRepository;
use App\Service\DirectChatService;
use App\Service\MessageService;
use Doctrine\ORM\EntityManagerInterface;
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
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
    ) {}

    #[Route('', name: 'new_chat', methods: ['POST'], format: 'json')]
    public function create(Request $request, #[CurrentUser] $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $participant = $this->userRepository->findOneBy(['id' => $data['participantId']]);

        if (!$participant) {
            return $this->json(['error' => 'Participant not found'], 404);
        }
        // dd( $participant);

        $newChat = new Chat();
        $newChat->setType(ChatTypeEnum::GROUP);
        $newChat->setCreatedBy($user);
        $this->em->persist($newChat);

        $chatParticipant = new ChatParticipant();
        $chatParticipant->setChat($newChat);
        $chatParticipant->setUser($user);
        $chatParticipant->setRole(ChatParticipantRoleEnum::MEMBER);
        $this->em->persist($chatParticipant);

        $chatParticipant = new ChatParticipant();
        $chatParticipant->setChat($newChat);
        $chatParticipant->setUser($participant);
        $chatParticipant->setRole(ChatParticipantRoleEnum::MEMBER);
        $this->em->persist($chatParticipant);
        $this->em->flush();

        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
    }

    #[Route('', name: 'get_chats', methods: ['GET'], format: 'json')]
    public function getAll(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
    }

    #[Route('/{id}', name: 'get_chat', methods: ['GET'], format: 'json')]
    public function get(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ChatController.php',
        ]);
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
        
        return $this->json([
            'chatId' => $chat->getId(),
            'type' => $chat->getType(),
            'messageId' => $message->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
        ], JsonResponse::HTTP_CREATED);
    }
}
