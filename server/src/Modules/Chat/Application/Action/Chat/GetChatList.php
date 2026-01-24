<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\ReadModel\Chat\ChatDTOMapper;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChatList
{
    public function __construct(
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly ChatDTOMapper $chatDTOMapper,
    ) {}

    public function __invoke(Uuid $currentUserId, int $page = 1, int $limit = 10): array 
    {
        
        $chats = $this->chatRepository->findUserChatsWithLastMessage($currentUserId, $page, $limit);

        $chatIds = array_map(fn(Chat $chat) => $chat->getId(), $chats);

        $unreadCounts = $this->messageRepository->getUnreadMessageCountForUserByChats($currentUserId, $chatIds);
        
        return array_map(function(Chat $chat) use ($currentUserId, $unreadCounts) {
            $id = $chat->getId()->toRfc4122();
            $unreadCount = $unreadCounts[$id] ?? 0;
            return $this->chatDTOMapper->toChatResponseDTO($chat, $currentUserId, $unreadCount);
        }, $chats);

    }
}
