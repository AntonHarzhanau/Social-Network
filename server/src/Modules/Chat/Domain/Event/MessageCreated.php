<?php

namespace App\Modules\Chat\Domain\Event;

final readonly class MessageCreated 
{
    public function __construct(
        public string $chatId,
        public array $message,
        public array $chat,
    ) {}
}
