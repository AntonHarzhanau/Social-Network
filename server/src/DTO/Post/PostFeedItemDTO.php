<?php

namespace App\DTO\Post;

use Symfony\Component\Serializer\Annotation\Groups;

final readonly class PostFeedItemDTO
{
    public function __construct(
        #[Groups(['post:feed'])]
        public string $id,

        #[Groups(['post:feed'])]
        public string $content,

        #[Groups(['post:feed'])]
        public \DateTimeImmutable $date,

        #[Groups(['post:feed'])]
        public int $likeCount,

        #[Groups(['post:feed'])]
        public int $commentCount,

        #[Groups(['post:feed'])]
        public bool $isLikedByCurrentUser,

        #[Groups(['post:feed'])]
        public PostAuthorDTO $author,

        #[Groups(['post:feed'])]
        public array $media,
    ) {}
}
