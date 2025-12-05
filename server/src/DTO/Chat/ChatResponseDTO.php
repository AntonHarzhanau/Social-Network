<?php

namespace App\DTO\Chat;

use App\DTO\Message\MessageResponseDTO;
use Symfony\Component\Serializer\Attribute\Groups;

final readonly class ChatResponseDTO
{
    public function __construct(
        #[Groups(['chat:list'])]
        public string $id,
        #[Groups(['chat:list'])]
        public string $type,
        #[Groups(['chat:list'])]
        public ?string $title = null,
        #[Groups(['chat:list'])]
        public ?string $avatarUrl = null,
        #[Groups(['chat:list'])]
        public ?MessageResponseDTO $lastMessage = null,
        public ?string $createdAt,
        public ?string $updatedAt,
        #[Groups(['chat:list'])]
        public ?string $lastMessageAt,
        #[Groups(['chat:list'])]
        public ?int $unreadMessageCount = null,
    ) {}
}
