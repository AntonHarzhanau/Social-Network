<?php

namespace App\Modules\Comment\Application\Command;

final readonly class AddComment 
{
    public function __construct(
        public string $content,
    ) {}
}
