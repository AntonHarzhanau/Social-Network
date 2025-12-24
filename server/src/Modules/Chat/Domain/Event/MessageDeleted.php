<?php

namespace App\Modules\Chat\Domain\Event;

final readonly class MessageDeleted
{
    public function __construct(
        public string $chatId,
        public string $messageId,
    ) {}
}
