<?php

namespace App\Modules\Chat\Infrastructure\Controller;

use App\DTO\Message\MessageResponseDTO;
use App\DTO\User\UserResponseDTO;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\User\Domain\Entity\User;
use App\Modules\Shared\Infrastructure\ChatNotifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/messages')]
final class MessageController extends AbstractController
{
    public function __construct() {}
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
