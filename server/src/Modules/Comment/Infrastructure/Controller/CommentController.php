<?php

namespace App\Modules\Comment\Infrastructure\Controller;

use App\Modules\Comment\Application\Action\DeleteCommentAction;
use App\Modules\Comment\Application\Action\GetCommentRepliesAction;
use App\Modules\Comment\Application\Action\LikeCommentAction;
use App\Modules\Comment\Application\Action\ReplyToCommentAction;
use App\Modules\Comment\Application\Action\UpdateCommentAction;
use App\Modules\Comment\Application\CommentService;
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

#[Route('/api/comments/{commentId}')]
final class CommentController extends AbstractController
{
    public function __construct() {}


    #[Route('', name: 'reply_to_comment', methods: ['POST'], format: 'json')]
    public function reply(
        string $commentId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $author,
        CreateCommentRequestMapper $mapper,
        ReplyToCommentAction $reply,
    ): JsonResponse {
        $reply(Uuid::fromString($commentId), $author->getId(), $mapper->map($dto));
        return $this->json(['message' => 'Reply created'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/replies', name: 'get_comment', methods: ['GET'], format: 'json')]
    public function getReplies(
        string $commentId,
        #[CurrentUser] User $currentUser,
        Request $request,
        GetCommentRepliesAction $getReplies,
    ): JsonResponse {
        $page = (int) $request->query->get('page', 1);
        $limit = (int) $request->query->get('limit', 10);
        $replies = $getReplies(Uuid::fromString($commentId), $currentUser->getId(), $page, $limit);

        return $this->json($replies, JsonResponse::HTTP_OK);
    }


    #[Route('/like', name: 'comment_like', methods: ['POST'], format: 'json')]
    public function like(
        string $commentId,
        #[CurrentUser] User $user,
        LikeCommentAction $like,
    ): JsonResponse {
        $likeResult = $like(Uuid::fromString($commentId), $user->getId());
        return $this->json($likeResult, JsonResponse::HTTP_OK);
    }

    #[Route('', name: 'delete_comment', methods: ['DELETE'], format: 'json')]
    public function delete(
        string $commentId,
        #[CurrentUser] User $user,
        DeleteCommentAction $delete,
    ): JsonResponse {
        $delete(Uuid::fromString($commentId), $user->getId());
        return $this->json([], JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'update_comment', methods: ['PUT'], format: 'json')]
    public function update(
        string $commentId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $user,
        CreateCommentRequestMapper $mapper,
        UpdateCommentAction $update,
    ): JsonResponse {
        $update(Uuid::fromString($commentId), $user->getId(), $mapper->map($dto));

        return $this->json([], JsonResponse::HTTP_CREATED);
    }
}
