<?php

namespace App\Controller;

use App\DTO\PostDTO\CreatePostDTO;
use App\Entity\Post;
use App\Entity\User;
use App\Service\PostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/post')]
final class PostController extends AbstractController
{
    public function __construct(
        private readonly PostService $postService,
    ) {}

    #[Route('', name: 'create_post', methods: ['POST'], format: 'json')]
    public function create(#[MapRequestPayload] CreatePostDTO $dto): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        // Assuming you have a PostService to handle the creation logic
        $this->postService->createPost($dto, $user);

        return $this->json([
            'message' => 'Post created successfully!',
        ]);
    }

    #[Route('', name: 'get_all_posts', methods: ['GET'], format: 'json')]
    public function getAll(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $posts = $this->postService->getAll();

        return $this->json($posts, 200, [], ['groups' => 'post:read']);
    }

    #[Route('/{id}', name: 'get_post_by_id', methods: ['GET'], format: 'json')]
    public function getById(string $id): JsonResponse
    {
        $post = $this->postService->getById($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        return $this->json($post, 200, [], ['groups' => 'post:read']);
    }

    #[Route('/{id}', name: 'delete_post', methods: ['DELETE'], format: 'json')]
    public function delete(Post $post): JsonResponse
    {
        $user = $this->getUser();

        $this->postService->deletePost($post, $user);

        return $this->json(['message' => 'Post deleted successfully']);
    }


    #[Route('/{id}/like', name: 'like_post', methods: ['POST'], format: 'json')]
    public function toggleLike(string $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !($user instanceof User)) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $post = $this->postService->getById($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        $this->postService->toggleLike($post, $user);

        return $this->json(['message' => 'Toggled like status successfully']);
    }
}
