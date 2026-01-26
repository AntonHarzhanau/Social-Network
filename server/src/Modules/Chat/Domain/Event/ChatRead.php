<?php

namespace App\Modules\Chat\Domain\Event;

final readonly class ChatRead 
{
    public function __construct(
        public string $chatId,
        public string $readerId,
        public \DateTimeImmutable $lastReadAt,
        public ?string $lastReadMessageId = null,
    ) {}
}
