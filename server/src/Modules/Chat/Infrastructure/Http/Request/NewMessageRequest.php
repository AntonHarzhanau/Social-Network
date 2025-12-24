<?php

namespace App\Modules\Chat\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class NewMessageRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public string $content,
    ) {}
}
