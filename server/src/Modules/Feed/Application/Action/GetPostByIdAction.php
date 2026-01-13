<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostResponse;
use App\Modules\Feed\Application\Service\PostFactory;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\Uid\Uuid;

final class GetPostByIdAction
{
    public function __construct(

        private readonly PostRepositoryInterface $postRepository,
        private readonly PostFactory $postFactory,
    ) {}

    public function execute(Uuid $postId, User $currentUser): ?PostResponse
    {
        $postEntity = $this->postRepository->findOnePostById($currentUser->getId(), $postId);
        if ($postEntity === null) {
            return null;
        }
        // dd(123, $postEntity);
        $post = $this->postFactory->toPostListResponse([$postEntity], $currentUser)[0] ?? null;
        return $post;
    }
}
