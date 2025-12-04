<?php

namespace App\Controller;

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

final class MessageController extends AbstractController
{
    #[Route('/api/chats/{id}/messages', methods: ['POST'])]
    public function send(
        string $id,
        Request $request,
        ChatRepository $chats,
        EntityManagerInterface $em,
        ChatNotifier $notifier,
        #[CurrentUser] User $user,
    ): JsonResponse {

        $chat = $chats->find($id);
        if (!$chat) {
            return $this->json(['error' => 'Chat not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $content = $data['content'] ?? null;

        if (!$content) {
            return $this->json(['error' => 'Content is required'], 422);
        }

        // 1) Создаём и сохраняем сообщение
        $message = new Message();
        $message->setChat($chat);
        $message->setSender($user);
        $message->setContent($content);

        $em->persist($message);
        $em->flush();

        // 2) Шлём обновление через Mercure
        $notifier->notifyNewMessage($message);

        // 3) Возвращаем JSON (DTO потом можно сделать нормальный)
        return $this->json([
            'id' => (string) $message->getId(),
            'chatId' => (string) $chat->getId(),
            'senderId' => (string) $user->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format(DATE_ATOM),
        ]);
    }
}
