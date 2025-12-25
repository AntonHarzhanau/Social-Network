<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\ReadModel\Chat\ChatDTOMapper;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChatList
{
    public function __construct(
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly ChatDTOMapper $chatDTOMapper,
    ) {}

    public function __invoke(Uuid $userId, int $page = 1, int $limit = 10): array 
    {
        
        $chats = $this->chatRepository->findUserChatsWithLastMessage($userId, $page, $limit);

        $items = [];
        foreach ($chats as $chat) {
            $items[] = $this->chatDTOMapper->toChatResponseDTO($chat, $userId); 
        }

        return $items;
    }
}
