<?php

namespace App\Modules\Chat\Application;

use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use App\Modules\User\Domain\Entity\User;

class MessageService
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function createMessage(Chat $chat, User $sender, string $content): Message
    {
        $message = $this->messageRepository->createMessage($chat, $sender, $content);
        return $message;
    }
}
