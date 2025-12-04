<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;

class MessageService
{
    public function __construct(
        private readonly MessageRepository $messageRepository,
    ) {}

    public function createMessage(Chat $chat, User $sender, string $content): Message
    {
        $message = $this->messageRepository->createMessage($chat, $sender, $content);
        return $message;
    }
}
