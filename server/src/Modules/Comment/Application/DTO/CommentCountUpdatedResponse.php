<?php

namespace App\Modules\Comment\Application\DTO;

final class CommentCountUpdatedResponse
{
    public function __construct(    
        public string $threadId,
        public int $commentCount,
    ) {}
}
