<?php

namespace App\Modules\Shared\Application\Message;

final readonly class UpsertNotification
{
    public function __construct(
        public string $type,
        public array $recipientsIds,

        public string $text,
        public array $payload,

        public ?string $groupKey = null,
        public bool $aggregate = false,
        
        public bool $private = false,
    ) {}
}
