<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final class DeletePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(Uuid $postId, User $user): void
    {
        $post = $this->postRepository->findOneById($postId);
        if (!$post) {
            throw new NotFoundHttpException('Post not found.');
        }
        if ($post->getAuthor() !== $user) {
            throw new AccessDeniedException('You do not have permission to delete this post.');
        }
        
        $this->postRepository->remove($post);
    }
    
}
