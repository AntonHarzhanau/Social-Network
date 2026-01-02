<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final class UpdatePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(Uuid $postId, $dto, $user): void
    {
        $post = $this->postRepository->findOneById($postId);

        if (!$post) {
            throw new NotFoundHttpException('Post not found.');
        }
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedException('You do not have permission to update this post.');
        }

        if ($dto->content !== null) {
            $post->setContent($dto->content);
        }

        if ($dto->visibility !== null) {
            $post->setVisibility($dto->visibility);
        }

        $this->postRepository->save($post);
    }
}
