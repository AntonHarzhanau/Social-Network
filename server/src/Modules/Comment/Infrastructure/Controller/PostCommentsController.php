<?php

namespace App\Modules\Comment\Infrastructure\Controller;

use App\Modules\Comment\Application\Action\GetPostCommentsAction;
use App\Modules\Comment\Application\Action\NewCommentAction;
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

#[Route('/api/posts')]
final class PostCommentsController extends AbstractController
{
    public function __construct() {}

    
    #[Route('/{postId}/comments', name: 'get_comments_for_post', methods: ['GET'], format: 'json')]
    public function getRootCommentsForPost(
        string $postId, #[CurrentUser] 
        User $currentUser, 
        Request $request,
        GetPostCommentsAction $getComments,
    ): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 2));
        $comments = $getComments(Uuid::fromString($postId), $currentUser->getId(), $page, $limit);

        return $this->json($comments, JsonResponse::HTTP_OK, []);
    }


    #[Route('/{postId}/comments', name: 'add_comment_to_post', methods: ['POST'], format: 'json')]
    public function addCommentToPost(
        string $postId,
        #[MapRequestPayload] CreateCommentRequest $dto,
        #[CurrentUser] User $author,
        CreateCommentRequestMapper $mapper,
        NewCommentAction $create
    ): JsonResponse {
        $create($mapper->map($dto), $author->getId(), Uuid::fromString($postId));
        return $this->json(['message' => 'Comment added successfully'], JsonResponse::HTTP_CREATED);
    }
}
