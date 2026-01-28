<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\ReadModel\Chat\ChatListAssembler;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChatList
{
    public function __construct(
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly ChatListAssembler $chatListAssembler,
    ) {
    }

    public function __invoke(Uuid $currentUserId, int $page = 1, int $limit = 10, bool $unreadOnly = false): array
    {
        $chats = $this->chatRepository->findUserChatsWithLastMessage($currentUserId, $page, $limit, $unreadOnly);

        return $this->chatListAssembler->assemble($currentUserId, $chats);

    }
}
