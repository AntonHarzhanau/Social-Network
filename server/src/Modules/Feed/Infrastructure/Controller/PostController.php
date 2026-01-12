<?php

namespace App\Modules\Feed\Infrastructure\Controller;

use App\Modules\Feed\Application\Action\Command\CreatePostCommand;
use App\Modules\Feed\Application\Action\CreatePostAction;
use App\Modules\Feed\Application\Action\DeletePostAction;
use App\Modules\Feed\Application\Action\GetAllPostsAction;
use App\Modules\Feed\Application\Action\GetPostByIdAction;
use App\Modules\Feed\Application\Action\GetPostsByWallAction;
use App\Modules\Feed\Application\Action\ToggleLikeAction;
use App\Modules\Feed\Application\Action\UpdatePostAction;
use App\Modules\Feed\Infrastructure\Http\Request\CreatePostRequest;
use App\Modules\Feed\Infrastructure\Http\Request\UpdatePostRequest;
use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/posts')]
final class PostController extends AbstractController
{
    public function __construct() {}


    #[Route('/{wallId}', name: 'create_post', methods: ['POST'], format: 'json')]
    public function create(
        string $wallId,
        #[MapRequestPayload] CreatePostRequest $dto,
        #[CurrentUser] User $user,
        CreatePostAction $action
    ): JsonResponse {
        $action->execute(
            new CreatePostCommand(
                wallId: Uuid::fromString($wallId),
                authorId: $user->getId(),
                content: $dto->content,
                mediaIds: $dto->mediaIds,
                visibility: $dto->visibility,
            )
        );

        return $this->json([
            'message' => 'Post created successfully!',
        ]);
    }


    #[Route('', name: 'get_posts', methods: ['GET'], format: 'json')]
    public function getAll(Request $request, #[CurrentUser] User $user, GetAllPostsAction $action): JsonResponse
    {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $visibilities = [VisibilityEnum::PUBLIC];

        $posts = $action->execute(
            page: $page,
            limit: $limit,
            visibilities: $visibilities,
            currentUserId: $user->getId(),
            // wallIds: [Uuid::fromString($wallId)],
        );
        return $this->json($posts, JsonResponse::HTTP_OK);
    }



    #[Route('/{id}', name: 'get_post_by_id', methods: ['GET'], format: 'json')]
    public function getById(string $id, #[CurrentUser] User $currentUser, GetPostByIdAction $action): JsonResponse
    {
        $post = $action->execute(
            postId: Uuid::fromString($id),
            currentUser: $currentUser,
        );
        if ($post === null) {
            return $this->json(['error' => 'Post not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        return $this->json($post, JsonResponse::HTTP_OK);
    }


    #[Route('/wall/{wallId}', name: 'get_posts_by_wall', methods: ['GET'], format: 'json')]
    public function getByWall(
        #[CurrentUser] User $user,
        string $wallId,
        Request $request,
        GetPostsByWallAction $action
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 2));

        $posts = $action->execute(
            currentUser: $user,
            wallId: Uuid::fromString($wallId),
            page: $page,
            limit: $limit,
        );

        return $this->json($posts, JsonResponse::HTTP_OK);
    }


    #[Route('/{postId}', name: 'delete_post', methods: ['DELETE'], format: 'json')]
    public function delete(string $postId, #[CurrentUser] User $user, DeletePostAction $action): JsonResponse
    {
        try {
            $action->execute(Uuid::fromString($postId), $user);
        } catch (AccessDeniedException $e) {
            return $this->json(['error' => 'Forbidden', 'message' => $e->getMessage()], 403);
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => 'Not Found', 'message' => $e->getMessage()], 404);
        }

        return $this->json(['message' => 'Post deleted successfully']);
    }


    // TODO: test
    #[Route('/{postId}', name: 'update_post', methods: ['PUT'], format: 'json')]
    public function update(
        string $postId,
        #[MapRequestPayload] UpdatePostRequest $dto,
        #[CurrentUser] User $user,
        UpdatePostAction $action,
    ): JsonResponse {
        try {
            $action->execute(Uuid::fromString($postId), $dto, $user);
        } catch (AccessDeniedException $e) {
            return $this->json(['error' => 'Forbidden', 'message' => $e->getMessage()], 403);
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => 'Not Found', 'message' => $e->getMessage()], 404);
        }

        return $this->json(['message' => 'Post updated successfully'], JsonResponse::HTTP_OK);
    }


    #[Route('/{postId}/like', name: 'like_post', methods: ['POST'], format: 'json')]
    public function toggleLike(string $postId, #[CurrentUser] User $user, ToggleLikeAction $action): JsonResponse
    {
        $responseDTO = $action->execute(Uuid::fromString($postId), $user);
        return $this->json($responseDTO, JsonResponse::HTTP_OK);
    }
}
