<?php

namespace App\Modules\Chat\Application\DTO;

final class ReadMessageResponse
{
    public function __construct(
        public readonly string $lastReadMessageId,
        public readonly string $lastReadAt,
        public readonly string $chatId,
    ) {
    }
}
