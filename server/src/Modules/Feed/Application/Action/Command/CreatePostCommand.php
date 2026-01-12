<?php

namespace App\Modules\Feed\Application\Action\Command;

use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use Symfony\Component\Uid\Uuid;

final class CreatePostCommand
{
    public function __construct(
        public readonly Uuid $wallId,
        public readonly Uuid $authorId,
        public readonly ?string $content = null,
        public readonly array $mediaIds = [],
        public readonly ?VisibilityEnum $visibility = null,
    ) {}
}
