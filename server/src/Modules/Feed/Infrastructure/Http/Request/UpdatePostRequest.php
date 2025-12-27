<?php

namespace App\Modules\Feed\Infrastructure\Http\Request;

use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdatePostRequest
{
    public function __construct(
        #[Assert\Length(max: 3000)]
        public ?string $content = null,

        public ?VisibilityEnum $visibility = null,

        public readonly ?array $mediaIds = null,
    ) {}
}
