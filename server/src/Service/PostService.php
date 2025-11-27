<?php

namespace App\Service;

use App\DTO\Post\CreatePostDTO;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\PostRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PostService
{
    public function __construct(
        private readonly PostRepository $postRepository,
    ) {}

    public function create(CreatePostDTO $dto, User $author): void
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

    public function delete(Post $post, User $user): void
    {
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedHttpException('You do not have permission to delete this post.');
        }
        $this->postRepository->remove($post);
    }

    public function toggleLike(Post $post, User $user): int 
    {
        if ($post->getLikeBy()->contains($user)) {
            $post->getLikeBy()->removeElement($user);
            $post->setLikeCount($post->getLikeCount() - 1);
        } else {
            $post->getLikeBy()->add($user);
            $post->setLikeCount($post->getLikeCount() + 1);
        }

        $this->postRepository->save($post);

        return $post->getLikeCount();
    }
}
