<?php

namespace App\Modules\Chat\Infrastructure\Http\Request;

final class MarkChatReadRequest
{
    public function __construct(
        public readonly ?string $lastReadMessageId = null,
    ) {}
}
