<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final readonly class GetUnreadChatCountAction
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {
    }

    public function execute(Uuid $userId): int
    {
        return $this->messageRepository->countUnreaChatsForUser($userId);
    }
}
