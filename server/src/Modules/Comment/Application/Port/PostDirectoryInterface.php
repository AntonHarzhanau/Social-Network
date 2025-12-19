<?php

namespace App\Modules\Comment\Application\Port;

use App\Modules\Feed\Domain\Entity\Post;
use Symfony\Component\Uid\Uuid;

interface PostDirectoryInterface
{
    public function getPost(Uuid $postId): ?Post;
    
}
