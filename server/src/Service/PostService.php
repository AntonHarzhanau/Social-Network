<?php

namespace App\Service;

use App\DTO\PostDTO\CreatePostDTO;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\PostRepository;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PostService
{
    public function __construct(
        private readonly PostRepository $postRepository,
    ) {}

    public function createPost(CreatePostDTO $dto, User $author): void
    {
        $post = new Post();
        $post->setContent($dto->content);
        
        if ($dto->visibility !== null) {
            $post->setVisibility($dto->visibility);
        }

        $post->setAuthor($author);
        $this->postRepository->save($post);
    }

    public function getAll(): array
    {
        return $this->postRepository->findAll();
    }

    public function getById(string $id): ?Post
    {
        return $this->postRepository->find($id);
    }

    public function deletePost(Post $post, User $user): void
    {
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedException('You do not have permission to delete this post.');
        }
        $this->postRepository->remove($post);
    }

    public function toggleLike(Post $post, User $user): void
    {
        if ($post->getLikeBy()->contains($user)) {
            $post->getLikeBy()->removeElement($user);
            $post->setLikeCount($post->getLikeCount() - 1);
        } else {
            $post->getLikeBy()->add($user);
            $post->setLikeCount($post->getLikeCount() + 1);
        }

        $this->postRepository->save($post);
    }
}
