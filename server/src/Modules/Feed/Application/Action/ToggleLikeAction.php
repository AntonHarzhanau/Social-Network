<?php

namespace App\Modules\Feed\Application\Action;

use App\DTO\Post\PostLikeResponseDTO;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class ToggleLikeAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(Uuid $postId, User $user): PostLikeResponseDTO
    {
        $post = $this->postRepository->findOneById($postId);
        if ($post->getLikeBy()->contains($user)) {
            $post->getLikeBy()->removeElement($user);
            $post->setLikeCount($post->getLikeCount() - 1);
        } else {
            $post->getLikeBy()->add($user);
            $post->setLikeCount($post->getLikeCount() + 1);
        }

        $this->postRepository->save($post);

        $dto = new PostLikeResponseDTO(
            postId: $post->getId(),
            likeCount: $post->getLikeCount(),
            isLikedByCurrentUser: $post->getLikeBy()->contains($user)
        );

        return $dto;
    }
}
