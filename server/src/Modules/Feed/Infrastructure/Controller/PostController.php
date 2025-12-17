<?php

namespace App\Modules\Feed\Infrastructure\Controller;

use App\DTO\Comment\CreateCommentDTO;
use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\UpdatePostDTO;
use App\Enum\VisibilityEnum;
use App\Factory\Post\PostFactory;
use App\Modules\Comment\Application\CommentService;
use App\Modules\Feed\Application\PostService;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/posts')]
final class PostController extends AbstractController
{
    public function __construct(
        private readonly PostService $postService,
        private readonly CommentService $commentService,
    ) {}


    #[Route('', name: 'create_post', methods: ['POST'], format: 'json')]
    public function create(
        #[MapRequestPayload] CreatePostDTO $dto,
        #[CurrentUser] User $user
    ): JsonResponse {
        $this->postService->create($dto, $user);

        return $this->json([
            'message' => 'Post created successfully!',
        ]);
    }


    #[Route('', name: 'get_posts', methods: ['GET'], format: 'json')]
    public function getAll(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 1));
        $visibilities = [VisibilityEnum::PUBLIC];

        $posts = $this->postService->getAll($page, $limit, $visibilities, $this->getUser());

        return $this->json(['posts' => $posts], JsonResponse::HTTP_OK, [], ['groups' => ['post:feed']]);
    }



    #[Route('/{id}', name: 'get_post_by_id', methods: ['GET'], format: 'json')]
    public function getById(string $id, #[CurrentUser] User $currentUser): JsonResponse
    {
        $post = $this->postService->getById($currentUser, $id);
        return $this->json($post, JsonResponse::HTTP_OK, [], ['groups' => ['post:full', 'media:read']]);
    }


    #[Route('/author/{author}', name: 'get_posts_by_author', methods: ['GET'], format: 'json')]
    public function getByAuthor(#[CurrentUser] User $user, User $author, Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 2));

        $posts = $this->postService->getByAuthor($user, $author, $page, $limit);

        return $this->json(['posts' => $posts], JsonResponse::HTTP_OK, [], ['groups' => ['post:feed']]);
    }


    #[Route('/{id}', name: 'delete_post', methods: ['DELETE'], format: 'json')]
    public function delete(Post $post, #[CurrentUser] User $user): JsonResponse
    {
        $this->postService->delete($post, $user);

        return $this->json(['message' => 'Post deleted successfully']);
    }


    // TODO: test
    #[Route('/{id}', name: 'update_post', methods: ['PUT'], format: 'json')]
    public function update(
        Post $post,
        #[MapRequestPayload] UpdatePostDTO $dto,
        #[CurrentUser] User $user,
        PostFactory $postFactory
    ): JsonResponse {
        try {
            $updated = $this->postService->update($post, $dto, $user);
        } catch (AccessDeniedHttpException $e) {
            return $this->json(['error' => 'Forbidden', 'message' => $e->getMessage()], 403);
        } catch (\RuntimeException $e) {
            return $this->json(['error' => 'Bad Request', 'message' => $e->getMessage()], 400);
        }

        $isLikedByCurrentUser = $updated->getLikeBy()->contains($user);
        $responseDTO = $postFactory->mapPostToPostFeedItemDTO($updated, $isLikedByCurrentUser);

        return $this->json($responseDTO, JsonResponse::HTTP_OK);
    }


    #[Route('/{id}/like', name: 'like_post', methods: ['POST'], format: 'json')]
    public function toggleLike(Post $post, #[CurrentUser] User $user): JsonResponse
    {
        $responseDTO = $this->postService->toggleLike($post, $user);

        return $this->json($responseDTO, JsonResponse::HTTP_OK);
    }


    #[Route('/{id}/comments', name: 'get_comments_for_post', methods: ['GET'], format: 'json')]
    public function getRootCommentsForPost(Post $post, #[CurrentUser] User $currentUser, Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 2));
        $comments = $this->commentService->getCommentsForPost($post, $currentUser, $page, $limit);

        return $this->json($comments, JsonResponse::HTTP_OK, []);
    }


    #[Route('/{id}/comments', name: 'add_comment_to_post', methods: ['POST'], format: 'json')]
    public function addCommentToPost(
        Post $post,
        #[MapRequestPayload] CreateCommentDTO $dto,
        #[CurrentUser] User $author
    ): JsonResponse {
        $this->commentService->create($dto, $author, $post);

        return $this->json(['message' => 'Comment added successfully'], JsonResponse::HTTP_CREATED);
    }
}
