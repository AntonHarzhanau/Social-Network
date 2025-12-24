<?php

namespace App\Modules\Chat\Infrastructure\Controller;

use App\Modules\Chat\Application\Action\Message\DeleteMessageAction;
use App\Modules\Chat\Application\Action\Message\EditMessageAction;
use App\Modules\Chat\Application\Action\Message\SendMessageToChatAction;
use App\Modules\Chat\Application\Action\Message\SendMessageToUserAction;
use App\Modules\Chat\Infrastructure\Http\Mapper\NewMessageRequestMapper;
use App\Modules\Chat\Infrastructure\Http\Request\NewMessageRequest;
use App\Modules\User\Domain\Entity\User;
use App\Modules\Shared\Infrastructure\ChatNotifier;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/messages')]
final class MessageController extends AbstractController
{
    public function __construct() {}

    #[Route('/{chatId}/chat', methods: ['POST'], format: 'json')]
    public function sendtoChat(
        string $chatId,
        #[MapRequestPayload] NewMessageRequest $data,
        #[CurrentUser] User $user,
        SendMessageToChatAction $sendMessage,
        NewMessageRequestMapper $mapper,
        ChatNotifier $notifier,
    ): JsonResponse {

        $message = $sendMessage(Uuid::fromString($chatId), $user->getId(), $mapper::map($data));

        // $notifier->notifyNewMessage($message);

        return $this->json(['message' => 'Message sent successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{userId}/direct', methods: ['POST'], format: 'json')]
    public function sendtoUser(
        string $userId,
        #[MapRequestPayload] NewMessageRequest $data,
        #[CurrentUser] User $currentUser,
        SendMessageToUserAction $sendMessage,
        NewMessageRequestMapper $mapper,
        // ChatNotifier $notifier,
    ): JsonResponse {

        $message = $sendMessage($currentUser->getId(), Uuid::fromString($userId), $mapper::map($data));

        // $notifier->notifyNewMessage($message);

        return $this->json(['message' => 'Message sent successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{messageId}', methods: ['PUT'], format: 'json')]
    public function editMessage(
        string $messageId,
        #[MapRequestPayload] NewMessageRequest $data,
        #[CurrentUser] User $currentUser,
        EditMessageAction $editMessage,
        NewMessageRequestMapper $mapper,
        // ChatNotifier $notifier,
    ): JsonResponse {

        $editMessage(Uuid::fromString($messageId), $currentUser->getId(), $mapper::map($data));

        return $this->json(['message' => 'Message edited successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/{messageId}', methods: ['DELETE'], format: 'json')]
    public function deleteMessage(
        string $messageId,
        #[CurrentUser] User $currentUser,
        DeleteMessageAction $deleteMessage,
        // ChatNotifier $notifier,
    ): JsonResponse {

        $deleteMessage(Uuid::fromString($messageId), $currentUser->getId());

        return $this->json(['message' => 'Message deleted successfully'], JsonResponse::HTTP_OK);
    }
}
