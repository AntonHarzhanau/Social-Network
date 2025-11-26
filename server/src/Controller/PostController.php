<?php

namespace App\Controller;

use App\DTO\Comment\CreateCommentDTO;
use App\DTO\Post\CreatePostDTO;
use App\Entity\Post;
use App\Entity\User;
use App\Service\CommentService;
use App\Service\PostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
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
    public function create(#[MapRequestPayload] CreatePostDTO $dto, #[CurrentUser] User $user): JsonResponse
    {
        $this->postService->create($dto, $user);

        return $this->json([
            'message' => 'Post created successfully!',
        ]);
    }


    #[Route('', name: 'get_all_posts', methods: ['GET'], format: 'json')]
    public function getAll(): JsonResponse
    {
        $posts = $this->postService->getAll();

        return $this->json($posts, 200, [], ['groups' => 'post:read']);
    }


    #[Route('/{id}', name: 'get_post_by_id', methods: ['GET'], format: 'json')]
    public function getById(Post $post): JsonResponse
    {
        return $this->json($post, 200, [], ['groups' => 'post:read']);
    }


    #[Route('/{id}', name: 'delete_post', methods: ['DELETE'], format: 'json')]
    public function delete(Post $post, #[CurrentUser] User $user): JsonResponse
    {
        $this->postService->delete($post, $user);

        return $this->json(['message' => 'Post deleted successfully']);
    }


    #[Route('/{id}/like', name: 'like_post', methods: ['POST'], format: 'json')]
    public function toggleLike(Post $post, #[CurrentUser] User $user): JsonResponse
    {
        $likeCount = $this->postService->toggleLike($post, $user);

        return $this->json(['message' => 'Toggled like status successfully', 'likeCount' => $likeCount]);
    }


    #[Route('/{id}/comments', name: 'get_comments_for_post', methods: ['GET'], format: 'json')]
    public function getCommentsForPost(Post $post): JsonResponse
    {
        $comments = $post->getComments();

        return $this->json($comments, 200, [], ['groups' => 'comment:read']);
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
