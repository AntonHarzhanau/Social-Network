<?php

namespace App\Modules\Comment\Infrastructure\Controller;

use App\DTO\Comment\CreateCommentDTO;
use App\Modules\Comment\Application\CommentService;
use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Identity\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/comments/{comment}')]
final class CommentController extends AbstractController
{
    public function __construct(
        private readonly CommentService $commentService,
    ) {}


    #[Route('', name: 'reply_to_comment', methods: ['POST'], format: 'json')]
    public function create(
        Comment $comment,
        #[MapRequestPayload] CreateCommentDTO $dto,
        #[CurrentUser] User $author
    ): JsonResponse {
        $this->commentService->replyToComment($comment, $dto, $author);
        return $this->json([], JsonResponse::HTTP_CREATED);
    }


    #[Route('/like', name: 'comment_like', methods: ['POST'], format: 'json')]
    public function like(
        Comment $comment,
        #[CurrentUser] User $user
    ): JsonResponse {
        $likeCount = $this->commentService->toggleLike($comment, $user);

        return $this->json(['likeCount' => $likeCount], JsonResponse::HTTP_OK);
    }

    #[Route('', name: 'delete_comment', methods: ['DELETE'], format: 'json')]
    public function delete(
        Comment $comment,
        #[CurrentUser] User $user
    ): JsonResponse {
        $this->commentService->delete($comment, $user);
        return $this->json([], JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'update_comment', methods: ['PUT'], format: 'json')]
    public function update(
        Comment $comment,
        #[MapRequestPayload] CreateCommentDTO $dto,
        #[CurrentUser] User $user
    ): JsonResponse {
        $this->commentService->update($comment, $dto, $user);

        return $this->json([], JsonResponse::HTTP_CREATED);
    }
}
