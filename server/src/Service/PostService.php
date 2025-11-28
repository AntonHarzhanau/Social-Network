<?php

namespace App\Service;

use App\DTO\Post\CreatePostDTO;
use App\DTO\Post\PostAuthorDTO;
use App\DTO\Post\PostFeedItemDTO;
use App\DTO\Post\UpdatePostDTO;
use App\Entity\Post;
use App\Entity\PostMediaBinding;
use App\Entity\User;
use App\Factory\Post\PostFactory;
use App\Repository\MediaAssetRepository;
use App\Repository\PostMediaBindingRepository;
use App\Repository\PostRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class PostService
{
    public function __construct(
        private readonly PostRepository $postRepository,
        private readonly PostFactory $postFactory,
        private readonly MediaAssetRepository $mediaAssetRepository,
        private readonly PostMediaBindingRepository $postMediaBindingRepository,
    ) {}

    public function create(CreatePostDTO $dto, User $author): void
    {
        $media = [];
        if (!empty($dto->mediaIds)) {
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
        $posts = $this->postRepository->findPosts(
            currentUser: $user,
            visibilities: $visibilities,
            page: $page,
            limit: $limit
        );

        $result = [];


        foreach ($posts as $postWithLikeFlagDTO) {
            $post = $postWithLikeFlagDTO->post;
            $likedByCurrentUser = $postWithLikeFlagDTO->likedByCurrentUser;

            $result[] = $this->postFactory->mapPostToPostFeedItemDTO($post, (bool)$likedByCurrentUser);
        }
        return $result;
    }

    public function getById(User $currentUser, string $id): ?PostFeedItemDTO
    {
        $rows = $this->postRepository->findPosts(currentUser: $currentUser, id: $id);
        if (count($rows) === 0) {
            return null;
        }
        $row = $rows[0];

        return $this->postFactory->mapPostToPostFeedItemDTO($row->post, $row->likedByCurrentUser);
    }

    public function getByAuthor(User $currentUser, User $author, int $page, int $limit): array
    {
        $rows = $this->postRepository->findPosts(
            currentUser: $currentUser,
            author: $author,
            page: $page,
            limit: $limit
        );

        $result = [];
        foreach ($rows as $postWithLikeFlagDTO) {
            $post = $postWithLikeFlagDTO->post;
            $likedByCurrentUser = $postWithLikeFlagDTO->likedByCurrentUser;

            $result[] = $this->postFactory->mapPostToPostFeedItemDTO($post, (bool)$likedByCurrentUser);
        }

        return $result;
    }

    public function delete(Post $post, User $user): void
    {
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedHttpException('You do not have permission to delete this post.');
        }
        $this->postRepository->remove($post);
    }

    // TODO: test!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    public function update(Post $post, UpdatePostDTO $dto, User $user): Post
    {
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedHttpException('You do not have permission to update this post.');
        }

        if ($dto->content !== null) {
            $post->setContent($dto->content);
        }

        if ($dto->visibility !== null) {
            $post->setVisibility($dto->visibility);
        }

        if ($dto->mediaIds !== null) {
            $this->syncPostMedia($post, $dto->mediaIds);
        }

        $hasContent = $post->getContent() !== null && trim($post->getContent()) !== '';
        $hasMedia = $post->getBindedMedia()->count() > 0;

        if (!$hasContent && !$hasMedia) {
            throw new \InvalidArgumentException('Post must have content or media.');
        }

        $this->postRepository->save($post);
        return $post;
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

    // TODO: test!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    private function syncPostMedia(Post $post, array $newMediaIds): void
    {
        foreach ($post->getBindedMedia() as $binding) {
            $post->removeBindedMedia($binding);
            $this->postMediaBindingRepository->remove($binding);
        }

        if (empty($newMediaIds)) {
            return;
        }

        $mediaAssets = $this->mediaAssetRepository->findBy(['id' => $newMediaIds]);

        foreach ($mediaAssets as $media) {
            $binding = new PostMediaBinding();
            $binding->setMedia($media);
            $post->addBindedMedia($binding);

            $this->postRepository->save($post);
        }
    }
}
