<?php

namespace App\Modules\Comment\Infrastructure\Http\Controller;

use App\Modules\Comment\Application\Action\DeleteCommentAction;
use App\Modules\Comment\Application\Action\GetCommentRepliesAction;
use App\Modules\Comment\Application\Action\GetCommentsAction;
use App\Modules\Comment\Application\Action\LikeCommentAction;
use App\Modules\Comment\Application\Action\NewCommentAction;
use App\Modules\Comment\Application\Action\ReplyToCommentAction;
use App\Modules\Comment\Application\Action\UpdateCommentAction;
use App\Modules\Comment\Infrastructure\Http\Mapper\CreateCommentRequestMapper;
use App\Modules\Comment\Infrastructure\Http\Request\CreateCommentRequest;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/comments')]
final class CommentController extends AbstractController
{
    public function __construct() {}

    #[Route('/{threadId}', name: 'get_comments_for_thread', methods: ['GET'], format: 'json')]
    public function getComments(
        string $threadId,
        #[CurrentUser]
        User $currentUser,
        Request $request,
        GetCommentsAction $action,
    ): JsonResponse {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $comments = $action->execute(Uuid::fromString($threadId), $currentUser->getId(), $page, $limit);

        return $this->json($comments, JsonResponse::HTTP_OK, []);
    }


    #[Route('/{threadId}', name: 'add_comment_to_thread', methods: ['POST'], format: 'json')]
    public function createComment(
        string $threadId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $author,
        CreateCommentRequestMapper $mapper,
        NewCommentAction $action
    ): JsonResponse {
        $dto = $action->execute($mapper->map($dto), $author->getId(), Uuid::fromString($threadId));
        return $this->json($dto, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{commentId}/reply', name: 'reply_to_comment', methods: ['POST'], format: 'json')]
    public function reply(
        string $commentId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $author,
        CreateCommentRequestMapper $mapper,
        ReplyToCommentAction $action,
    ): JsonResponse {
        $action->execute(Uuid::fromString($commentId), $author->getId(), $mapper->map($dto));
        return $this->json(['message' => 'Reply created'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{commentId}/replies', name: 'get_comment_replies', methods: ['GET'], format: 'json')]
    public function getReplies(
        string $commentId,
        #[CurrentUser] User $currentUser,
        Request $request,
        GetCommentRepliesAction $action,
    ): JsonResponse {
        $page = (int) $request->query->get('page', 1);
        $limit = (int) $request->query->get('limit', 10);
        $replies = $action->execute(Uuid::fromString($commentId), $currentUser->getId(), $page, $limit);
        return $this->json($replies, JsonResponse::HTTP_OK);
    }


    #[Route('/{commentId}/like', name: 'comment_like', methods: ['POST'], format: 'json')]
    public function like(
        string $commentId,
        #[CurrentUser] User $user,
        LikeCommentAction $action,
    ): JsonResponse {
        $likeResult = $action->execute(Uuid::fromString($commentId), $user->getId());
        return $this->json($likeResult, JsonResponse::HTTP_OK);
    }

    #[Route('/{commentId}', name: 'delete_comment', methods: ['DELETE'], format: 'json')]
    public function delete(
        string $commentId,
        #[CurrentUser] User $user,
        DeleteCommentAction $action,
    ): JsonResponse {
        $dto = $action->execute(Uuid::fromString($commentId), $user->getId());
        return $this->json($dto, JsonResponse::HTTP_OK);
    }

    #[Route('/{commentId}', name: 'update_comment', methods: ['PUT'], format: 'json')]
    public function update(
        string $commentId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $user,
        CreateCommentRequestMapper $mapper,
        UpdateCommentAction $action,
    ): JsonResponse {
        $action->execute(Uuid::fromString($commentId), $user->getId(), $mapper->map($dto));

        return $this->json([], JsonResponse::HTTP_CREATED);
    }
}
