<?php

namespace App\Modules\Chat\Domain\Event;

final readonly class MessageUpdated
{
    public function __construct(
        public string $chatId,
        public string $messageId,
        public array $message,
    ) {}
}
