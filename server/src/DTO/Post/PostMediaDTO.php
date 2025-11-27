<?php

namespace App\DTO\Post;

use Symfony\Component\Serializer\Attribute\Groups;

final readonly class PostMediaDTO
{
    public function __construct(
        #[Groups (['post:feed'])]
        public string $id,

        #[Groups (['post:feed'])]
        public string $url,

        #[Groups (['post:feed'])]
        public string $type,
    ) {}
}
