<?php

namespace App\Modules\Feed\Infrastructure\Controller;

// use App\DTO\Comment\CreateCommentDTO;
use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\UpdatePostDTO;
use App\Enum\VisibilityEnum;
// use App\Modules\Comment\Application\CommentService;
use App\Modules\Feed\Application\Action\CreatePostAction;
use App\Modules\Feed\Application\Action\DeletePostAction;
use App\Modules\Feed\Application\Action\GetAllPostsAction;
use App\Modules\Feed\Application\Action\GetPostByIdAction;
use App\Modules\Feed\Application\Action\GetPostsByAuthor;
use App\Modules\Feed\Application\Action\ToggleLikeAction;
use App\Modules\Feed\Application\Action\UpdatePostAction;
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
    public function __construct(
        // private readonly CommentService $commentService,
    ) {}


    #[Route('', name: 'create_post', methods: ['POST'], format: 'json')]
    public function create(
        #[MapRequestPayload] CreatePostDTO $dto,
        #[CurrentUser] User $user,
        CreatePostAction $create
    ): JsonResponse {
        $create(
            $dto->content,
            $dto->mediaIds ?? [],
            $user->getId(),
            $dto->visibility ?? VisibilityEnum::PUBLIC,
        );

        return $this->json([
            'message' => 'Post created successfully!',
        ]);
    }


    #[Route('', name: 'get_posts', methods: ['GET'], format: 'json')]
    public function getAll(Request $request, #[CurrentUser] User $user, GetAllPostsAction $getAll): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 1));
        $visibilities = [VisibilityEnum::PUBLIC];

        $posts = $getAll(
            page: $page,
            limit: $limit,
            visibilities: $visibilities,
            currentUserId: $user->getId(),
        );
        return $this->json($posts, JsonResponse::HTTP_OK);
    }



    #[Route('/{id}', name: 'get_post_by_id', methods: ['GET'], format: 'json')]
    public function getById(string $id, #[CurrentUser] User $currentUser, GetPostByIdAction $getById): JsonResponse
    {
        $post = $getById(
            postId: $id,
            currentUser: $currentUser,
        );
        return $this->json($post, JsonResponse::HTTP_OK);
    }


    #[Route('/author/{authorId}', name: 'get_posts_by_author', methods: ['GET'], format: 'json')]
    public function getByAuthor(
        #[CurrentUser] User $user,
        string $authorId,
        Request $request,
        GetPostsByAuthor $getByAuthor
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 2));

        $posts = $getByAuthor(
            currentUser: $user,
            authorId: Uuid::fromString($authorId),
            page: $page,
            limit: $limit,
        );

        return $this->json($posts, JsonResponse::HTTP_OK);
    }


    #[Route('/{postId}', name: 'delete_post', methods: ['DELETE'], format: 'json')]
    public function delete(string $postId, #[CurrentUser] User $user, DeletePostAction $delete): JsonResponse
    {
        try {
            $delete(Uuid::fromString($postId), $user);
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
        #[MapRequestPayload] UpdatePostDTO $dto,
        #[CurrentUser] User $user,
        UpdatePostAction $update,
    ): JsonResponse {
        try {
            $update(Uuid::fromString($postId), $dto, $user);
        } catch (AccessDeniedException $e) {
            return $this->json(['error' => 'Forbidden', 'message' => $e->getMessage()], 403);
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => 'Not Found', 'message' => $e->getMessage()], 404);
        }

        return $this->json(['message' => 'Post updated successfully'], JsonResponse::HTTP_OK);
    }


    #[Route('/{postId}/like', name: 'like_post', methods: ['POST'], format: 'json')]
    public function toggleLike(string $postId, #[CurrentUser] User $user, ToggleLikeAction $toggleLike): JsonResponse
    {
        $responseDTO = $toggleLike(Uuid::fromString($postId), $user);
        return $this->json($responseDTO, JsonResponse::HTTP_OK);
    }


    // #[Route('/{id}/comments', name: 'get_comments_for_post', methods: ['GET'], format: 'json')]
    // public function getRootCommentsForPost(Post $post, #[CurrentUser] User $currentUser, Request $request): JsonResponse
    // {
    //     $page = max(1, (int) $request->query->get('page', 1));
    //     $limit = max(1, (int) $request->query->get('limit', 2));
    //     $comments = $this->commentService->getCommentsForPost($post, $currentUser, $page, $limit);

    //     return $this->json($comments, JsonResponse::HTTP_OK, []);
    // }


    // #[Route('/{id}/comments', name: 'add_comment_to_post', methods: ['POST'], format: 'json')]
    // public function addCommentToPost(
    //     Post $post,
    //     #[MapRequestPayload] CreateCommentDTO $dto,
    //     #[CurrentUser] User $author
    // ): JsonResponse {
    //     $this->commentService->create($dto, $author, $post);

    //     return $this->json(['message' => 'Comment added successfully'], JsonResponse::HTTP_CREATED);
    // }
}
