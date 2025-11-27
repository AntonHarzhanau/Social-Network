<?php

namespace App\Service;

use App\DTO\Post\CreatePostDTO;
use App\Entity\Post;
use App\Entity\User;
use App\Factory\Post\PostFactory;
use App\Repository\MediaAssetRepository;
use App\Repository\PostRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class PostService
{
    public function __construct(
        private readonly PostRepository $postRepository,
        private readonly PostFactory $postFactory,
        private readonly MediaAssetRepository $mediaAssetRepository,
    ) {}

    public function create(CreatePostDTO $dto, User $author): void
    {
        $media = [];
        if (!empty($dto->mediaIds)){
            $media = $this->mediaAssetRepository->findBy(['id' => $dto->mediaIds]);
        }

        $post = $this->postFactory->createPostFromDTO($dto, $author, $media);

        $this->postRepository->save($post);
    }

    public function getAll(
        int $page,
        int $limit,
        array $visibilities,
        User $user
    ): array {
        $posts = $this->postRepository->getAllPosts($page, $limit, $visibilities);
        $likedPostIds = $this->postRepository->findLikedPostIdsByUser($user, $posts);
        $likedPostMap = array_fill_keys($likedPostIds, true);

        $result = array_map(
            fn(Post $post) => $this->postFactory->mapPostToPostFeedItemDTO($post, $likedPostMap),
            $posts
        );

        usort(
            $result,
            fn($a, $b) => $b->date->getTimestamp() <=> $a->date->getTimestamp()
        );


        return $result;
    }

    public function getById(string $id): ?Post
    {
        return $this->postRepository->find($id);
    }

    public function getByAuthor(User $author, int $page = 1, int $limit = 2): array
    {
        return $this->postRepository->findBy(['author' => $author], ['createdAt' => 'DESC'], $limit, ($page - 1) * $limit);
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
