<?php

namespace App\Modules\Comment\Infrastructure\Adapter;

use App\Modules\Comment\Application\Port\PostDirectoryInterface;
use App\Modules\Feed\Api\PostApiInterface;
use App\Modules\Feed\Domain\Entity\Post;
use Symfony\Component\Uid\Uuid;

final class PostDirectoryAdapter implements PostDirectoryInterface
{
    public function __construct(private PostApiInterface $postService) {}

    public function getPost(Uuid $postId): ?Post
    {
        $post = $this->postService->getPost($postId);

        return $post;
    }
}
