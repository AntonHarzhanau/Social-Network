<?php

namespace App\DTO\Post;

use App\Modules\Shared\Domain\Enum\VisibilityEnum;
use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdatePostDTO
{
    public function __construct(
        #[Assert\Length(max: 3000)]
        public ?string $content = null,

        public ?VisibilityEnum $visibility = null,

        public readonly ?array $mediaIds = null,
    ) {}
}
