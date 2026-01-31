<?php

namespace App\Modules\Group\Infrastructure\Http\Request;

use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use Symfony\Component\Validator\Constraints as Assert;

final readonly class UpdateGroupRequest
{
    public function __construct(
        #[Assert\Type('string')]
        #[Assert\Length(min: 3, max: 100)]
        public readonly ?string $name,

        #[Assert\Type('string')]
        #[Assert\Length(max: 500)]
        public readonly ?string $description,

        #[Assert\Choice(
            callback: [GroupVisibilityEnum::class, 'values'],
            message: 'Field "visibility" must be one of: {{ choices }}.'
        )]
        public ?string $visibility,
    ) {
    }
}
