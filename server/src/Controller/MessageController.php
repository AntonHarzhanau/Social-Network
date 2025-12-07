<?php

namespace App\Controller;

use App\DTO\Message\MessageResponseDTO;
use App\DTO\User\UserResponseDTO;
use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\ChatRepository;
use App\Service\ChatNotifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/messages')]
final class MessageController extends AbstractController
{
    public function __construct(
        private readonly ChatRepository $chatRepository,
    ) {}
    #[Route('/{chat}', methods: ['POST'])]
    public function send(
        Chat $chat,
        Request $request,
        EntityManagerInterface $em,
        ChatNotifier $notifier,
        #[CurrentUser] User $user,
    ): JsonResponse {

        if (!$chat) {
            return $this->json(['error' => 'Chat not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $content = $data['content'] ?? null;
        
        if (!$content) {
            return $this->json(['error' => 'Content is required'], 422);
        }

   
        $message = new Message();
        $message->setSender($user);
        $message->setContent($content);
        $chat->addMessage($message);

        $em->persist($message);
        $em->flush();

        
        $notifier->notifyNewMessage($message);
        $message = new MessageResponseDTO(
            
            id: $message->getId(),
            chatId: $chat->getId(),
            sender: new UserResponseDTO(
                id: $user->getId(),
                username: $user->getUsername(),
                avatarUrl: $user->getAvatarUrl(),
            ),
            content: $message->getContent(),
            createdAt: $message->getCreatedAt()->format(DATE_ATOM),
        );
        return $this->json($message, 201, [], ['groups' => 'message:list']);
    }
}
