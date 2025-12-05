<?php

namespace App\DTO\Message;

use App\DTO\User\UserResponseDTO;
use Symfony\Component\Serializer\Attribute\Groups;

final readonly class MessageResponseDTO
{
    public function __construct(
        #[Groups(['chat:list', 'message:list'])]
        public string $id,
        #[Groups(['chat:list', 'message:list'])]
        public UserResponseDTO $sender,
        #[Groups(['chat:list', 'message:list'])]
        public ?string $content,
        #[Groups(['chat:list', 'message:list'])]
        public ?string $createdAt,
        public ?string $chatId = null,
        public ?string $updatedAt = null,
    ) {}
}
