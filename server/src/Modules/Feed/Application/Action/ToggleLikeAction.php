<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;
use App\Modules\Feed\Application\DTO\PostMutationResponse;

final class ToggleLikeAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(Uuid $postId, User $user): PostMutationResponse
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

        $dto = new PostMutationResponse($post->getId()->toRfc4122());

        return $dto;
    }
}
