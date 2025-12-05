<?php

namespace App\Service;

use App\Entity\User;
use App\Factory\Chat\ChatFactory;
use App\Repository\ChatRepository;

class ChatService
{
    public function __construct(
        private readonly ChatRepository $chatRepository,
        private readonly ChatFactory $chatFactory,
    ) {}

    public function getChatListForUser(User $currentUser): array
    {
        $chats = $this->chatRepository->findUserChatsWithLastMessage($currentUser);
        $items = [];
        
        foreach ($chats as $chat) {
            $items[] = $this->chatFactory->toChatResponseDTO($chat, $currentUser);
        }

        return $items;
    } 
}
