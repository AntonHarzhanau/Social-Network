<?php

namespace App\Modules\Feed\Infrastructure\Http\Request;

use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

final readonly class CreatePostRequest
{
    public function __construct(
        #[Assert\Length(max: 3000)]
        public ?string $content = null,

        public VisibilityEnum $visibility = VisibilityEnum::PUBLIC,

        #[Assert\Type('array')]
        public readonly array $mediaIds = [],
    ) {}

    #[Assert\Callback]
    public function validateNotEmptyContentOrMedia(ExecutionContextInterface $context): void
    {
        if (empty($this->content) && empty($this->mediaIds)) {
            $context
                ->buildViolation('Post must have content or media.')
                ->atPath('content')
                ->addViolation();
        }
    }
}
