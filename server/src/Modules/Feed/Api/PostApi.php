<?php

namespace App\Modules\Feed\Api;

use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

class PostApi implements PostApiInterface
{
    public function __construct(private PostRepositoryInterface $postRepository) {}
    public function getPost(Uuid $postId): ?Post
    {
        return $this->postRepository->findOneById($postId);
    }
}
