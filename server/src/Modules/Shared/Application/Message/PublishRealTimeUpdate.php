<?php

namespace App\Modules\Shared\Application\Message;

final readonly class PublishRealTimeUpdate
{
    public function __construct(
        public string|array $topics,
        public array $data,
        public bool $private = true,
    ) {}
}
