<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;
use App\Modules\Feed\Application\DTO\PostMutationResponse;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Infrastructure\Persistence\Doctrine\Repository\PostLikeRepository;

final class ToggleLikeAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly PostLikeRepository $postLikeRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(Uuid $postId, User $user): PostMutationResponse
    {
        $user = $this->userDirectory->getUser($user->getId());
        if ($user === null) {
            throw new \RuntimeException('User not found');
        }

        $post = $this->postRepository->findOneById($postId);
        if ($post === null) {
            throw new \RuntimeException('Post not found');
        }

        $like = $this->postLikeRepository->findOneBy([
            'post' => $post,
            'user' => $user,
        ]);

        if ($like !== null) {
            // Unlike
            $this->postLikeRepository->remove($like, true);
            $post->setLikeCount($post->getLikeCount() - 1);
        } else {
            // Like
            $like = new \App\Modules\Feed\Domain\Entity\PostLike();
            $like->setPost($post);
            $like->setUser($user);
            $this->postLikeRepository->save($like, true);
            $post->setLikeCount($post->getLikeCount() + 1);
        }
        $this->postRepository->save($post, true);
        return new PostMutationResponse($post->getId());
    }
}
