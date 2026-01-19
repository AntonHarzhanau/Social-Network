<?php

namespace App\Modules\Group\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateGroupRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 2, max: 100)]
        public string $name,

        #[Assert\Length(max: 500)]
        public ?string $description = null,

        #[Assert\Choice(choices: ['public', 'private'])]
        public string $visibility = 'public',
    ) {
    }
}
