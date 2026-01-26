<?php

namespace App\Modules\Chat\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class ChatListItemDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly ?string $title,

        public readonly ?string $avatarUrl,

        public readonly string $createdAt,
        public readonly ?string $updatedAt,

        public readonly ?string $lastReadMessageId,
        public readonly ?string $lastReadAt,

        public readonly ?ChatMessagePreviewDTO $lastMessage,
        public readonly int $unreadMessageCount,

        public readonly ?string $lastReadMessageByOther,
        public readonly ?string $lastReadAtByOther,
    ) {
    }
}
