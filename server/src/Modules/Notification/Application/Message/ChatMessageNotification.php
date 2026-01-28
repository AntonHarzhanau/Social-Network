<?php

namespace App\Modules\Notification\Application\Message;

use Symfony\Component\Uid\Uuid;

final readonly class ChatMessageNotification
{
    public function __construct(
        public Uuid $chatId,
        public Uuid $senderId,
        public array $messagePayload,
        public array $chatSnapshot,
    ) {
    }
}
