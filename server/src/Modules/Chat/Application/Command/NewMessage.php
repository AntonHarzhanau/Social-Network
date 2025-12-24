<?php

namespace App\Modules\Chat\Application\Command; 

final readonly class NewMessage
{
    public function __construct(
        public string $content,
    ) {}
}
