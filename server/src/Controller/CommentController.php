<?php

namespace App\Controller;

use App\DTO\Comment\CreateCommentDTO;
use App\Entity\Comment;
use App\Entity\Post;
use App\Entity\User;
use App\Service\CommentService;
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
}
