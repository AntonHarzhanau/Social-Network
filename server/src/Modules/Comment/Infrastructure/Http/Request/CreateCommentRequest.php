<?php

namespace App\Modules\Comment\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class CreateCommentRequest 
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 2000)]
        public string $content
    ) {}
}
