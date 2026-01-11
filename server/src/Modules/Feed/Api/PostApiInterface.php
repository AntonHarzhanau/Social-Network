<?php

namespace App\Modules\Feed\Api;

use App\Modules\Feed\Domain\Entity\Post;
use Symfony\Component\Uid\Uuid;

interface PostApiInterface
{
    public function getPost(Uuid $postId): ?Post;
    public function getPostsByAuthor(Uuid $authorId): ?Post;
    public function getPostByCommentThreadId(Uuid $threadId): ?Post;
}
