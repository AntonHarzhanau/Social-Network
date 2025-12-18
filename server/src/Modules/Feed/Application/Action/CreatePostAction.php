<?php

namespace App\Modules\Feed\Application\Action;

use App\Enum\VisibilityEnum;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class CreatePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
    ) {}

    public function __invoke(?string $content, array $mediaIds, Uuid $authorId, VisibilityEnum $visibility): void
    {
     
    }
}
