<?php

namespace App\Modules\Chat\Infrastructure\Http\Controller;

use App\Modules\Chat\Application\Action\Chat\AddUserToChat;
use App\Modules\Chat\Application\Action\Chat\ChangeMemberRole;
use App\Modules\Chat\Application\Action\Chat\CreateGroupChat;
use App\Modules\Chat\Application\Action\Chat\GetChat;
use App\Modules\Chat\Application\Action\Chat\GetChatList;
use App\Modules\Chat\Application\Action\Chat\GetChatMembers;
use App\Modules\Chat\Application\Action\Chat\GetChatMessages;
use App\Modules\Chat\Application\Action\Chat\GetUnreadChatCountAction;
use App\Modules\Chat\Application\Action\Chat\MarkChatReadAction;
use App\Modules\Chat\Application\Action\Chat\MuteChatAction;
use App\Modules\Chat\Application\Action\Chat\RemoveUserFromChat;
use App\Modules\Chat\Application\Action\Chat\UpdateChatInfo;
use App\Modules\Chat\Infrastructure\Http\Request\CreateChatRequest;
use App\Modules\Chat\Infrastructure\Http\Request\MarkChatReadRequest;
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
    public function __construct()
    {
    }

    #[Route('', name: 'new_chat', methods: ['POST'], format: 'json')]
    public function createGroupChat(
        Request $request,
        #[CurrentUser] $currentUser,
        #[MapRequestPayload] CreateChatRequest $data,
        CreateGroupChat $createGroupChat
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $id = $createGroupChat(
            $currentUser->getId(),
            $data['title'],
            $data['avatarUrl'] ?? null,
            $data['participantIds']
        );

        return $this->json(['chatId' => $id], JsonResponse::HTTP_CREATED);
    }

    #[Route('', name: 'get_chats', methods: ['GET'], format: 'json')]
    public function getAll(
        #[CurrentUser] User $user,
        Request $request,
        GetChatList $getChatList,
    ): JsonResponse {

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));
        $isUnreadOnly = $request->query->get('filter', 'all') === 'unread' ? true : false;

        $dto = $getChatList($user->getId(), $page, $limit, $isUnreadOnly);

        return $this->json(
            $dto,
            JsonResponse::HTTP_OK,
        );
    }

    #[Route('/unread-summary', name: 'get_unread_summary', methods: ['GET'], format: 'json')]
    public function getUnreadChatsCount(
        #[CurrentUser] User $currentUser,
        GetUnreadChatCountAction $action,
    ): JsonResponse {
        $count = $action->execute($currentUser->getId());
        return $this->json(
            $count,
            JsonResponse::HTTP_OK,
        );
    }


    #[Route('/{chatId}', name: 'update_chat', methods: ['PUT'], format: 'json')]
    public function update(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        UpdateChatInfo $updateChatInfo
    ): JsonResponse {
        $avatarId = $request->request->get('avatarId');
        $chatName = $request->request->get('chatName');
        $updateChatInfo->execute(
            Uuid::fromString($chatId),
            $currentUser->getId(),
            $avatarId !== null ? Uuid::fromString($avatarId) : null,
            $chatName
        );
        return $this->json([
            'message' => 'Chat updated successfully',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('', name: 'delete_chat', methods: ['DELETE'], format: 'json')]
    public function delete(): JsonResponse
    {
        return $this->json([
            'error' => 'Not implemented yet',
        ], JsonResponse::HTTP_NOT_IMPLEMENTED);
    }

    #[Route('/{chatId}/members', name: 'get_chat_members', methods: ['GET'], format: 'json')]
    public function getChatMembers(
        string $chatId,
        #[CurrentUser] User $currentUser,
        GetChatMembers $action,
        Request $request,
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));
        $search = $request->query->get('search', null);

        $members = $action->execute(Uuid::fromString($chatId), $currentUser->getId(), $page, $limit, $search);

        return $this->json($members, JsonResponse::HTTP_OK);
    }

    #[Route('/{chatId}/add-members', name: 'add_user_to_chat', methods: ['POST'], format: 'json')]
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

    #[Route('/{chatId}/remove-members', name: 'remove_user_from_chat', methods: ['POST'], format: 'json')]
    public function removeUserFromChat(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        RemoveUserFromChat $removeUserFromChat
    ): JsonResponse {
        $id = json_decode($request->getContent(), true);

        $removeUserFromChat($currentUser->getId(), Uuid::fromString($id['userId']), Uuid::fromString($chatId));

        return $this->json(['message' => 'User(s) removed from chat'], JsonResponse::HTTP_OK, [], ['groups' => 'message:list']);
    }


    #[Route('/{chatId}/change-member-role', methods: ['POST'], format: 'json')]
    public function changeMemberRole(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        ChangeMemberRole $changeMemberRole
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $changeMemberRole->execute(
            Uuid::fromString($chatId),
            Uuid::fromString($data['userId']),
            $currentUser->getId(),
            $data['newRole']
        );

        return $this->json(['message' => 'Member role changed successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/{chatId}/mute', name: 'mute_chat', methods: ['POST'], format: 'json')]
    public function muteChatToggle(
        string $chatId,
        #[CurrentUser] User $currentUser,
        MuteChatAction $action,
    ): JsonResponse {
        $isMuted = $action->execute(Uuid::fromString($chatId), $currentUser->getId());

        return $this->json(['isMuted' => $isMuted], JsonResponse::HTTP_OK);
    }

    #[Route('/{chatId}/read', name: 'mark_chat_as_read', methods: ['PATCH'], format: 'json')]
    public function markRead(
        string $chatId,
        #[CurrentUser] User $currentUser,
        #[MapRequestPayload] MarkChatReadRequest $data,
        MarkChatReadAction $action,
    ): JsonResponse {

        $response = $action->execute(
            Uuid::fromString($chatId),
            $currentUser->getId(),
            $data->lastReadMessageId ? Uuid::fromString($data->lastReadMessageId) : null
        );

        return $this->json($response, JsonResponse::HTTP_OK);
    }

    #[Route('/{chatId}/messages', name: 'chat_messages', methods: ['GET'], format: 'json')]
    public function messages(
        string $chatId,
        #[CurrentUser] User $currentUser,
        Request $request,
        GetChatMessages $action,
    ): JsonResponse {
        $mode = (string) $request->query->get('mode', '');
        $messageId = $request->query->get('messageId');
        $limit = max(1, (int) $request->query->get('limit', 10));

        $mode = $mode === '' ? 'latest' : $mode;
        if (!\in_array($mode, ['latest', 'before', 'after', 'around'], true)) {
            return $this->json(['error' => 'mode must be before|after|around or omitted'], 400);
        }

        $messages = $action->execute(
            Uuid::fromString($chatId),
            $currentUser->getId(),
            $mode,
            $messageId !== null && $messageId !== '' ? Uuid::fromString((string) $messageId) : null,
            $limit
        );

        return $this->json($messages, JsonResponse::HTTP_OK);
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
        );
    }
}
