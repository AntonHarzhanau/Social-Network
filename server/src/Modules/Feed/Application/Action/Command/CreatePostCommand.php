<?php

namespace App\Modules\Feed\Application\Action\Command;

use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use Symfony\Component\Uid\Uuid;

final class CreatePostCommand
{
    public function __construct(
        public readonly Uuid $authorId,
        public readonly Uuid $wallId,
        public readonly ?string $content,
        public readonly VisibilityEnum $visibility,
        /** @var Uuid[] */
        public readonly array $mediaIds = [],
        public readonly ?Uuid $originalPostId = null,
        public readonly ?string $quote = null,
    ) {}
}
