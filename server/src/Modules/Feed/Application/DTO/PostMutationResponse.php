<?php

namespace App\Modules\Feed\Application\DTO;

final readonly class PostMutationResponse
{
    public function __construct(
        public string $id,
    ) {}
}
