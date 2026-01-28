<?php

namespace App\Modules\Chat\Application\DTO;

use App\Modules\Chat\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;

final class ChatListItemRowDTO
{
    public function __construct(
        public readonly string $chatId,
        public readonly ChatTypeEnum $type,
        public readonly ?string $title,
        public readonly ?string $avatarUrl,

        public readonly \DateTimeInterface $createdAt,
        public readonly ?\DateTimeInterface $updatedAt,

        public readonly ?string $lastReadMessageId,
        public readonly ?\DateTimeInterface $lastReadAt,
        public readonly ChatParticipantRoleEnum $currentUserRole,
        public readonly bool $isMuted,

        public readonly ?string $lastMessageId,
        public readonly ?string $lastMessageContent,
        public readonly ?\DateTimeInterface $lastMessageCreatedAt,
        public readonly ?string $lastSenderId,

        public readonly ?string $directOtherUserId,
        public readonly ?string $lastReadMessageByOther,
        public readonly ?\DateTimeInterface $lastReadAtByOther,
    ) {}
}
