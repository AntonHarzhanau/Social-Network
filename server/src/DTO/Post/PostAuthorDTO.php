<?php

namespace App\DTO\Post;

use Symfony\Component\Serializer\Annotation\Groups;

final readonly class PostAuthorDTO
{
    public function __construct(
        #[Groups(['post:feed'])]
        public string $id,

        #[Groups(['post:feed'])]
        public string $username,

        #[Groups(['post:feed'])]
        public ?string $avatarUrl,
    ) {}
}
