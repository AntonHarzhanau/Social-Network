<?php

namespace App\Service;

use App\Entity\Message;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class ChatNotifier
{
    public function __construct(
        private readonly HubInterface $hub,
    ) {}

    public function notifyNewMessage(Message $message): void
    {
        $chat = $message->getChat();
        $sender = $message->getSender();

        // 1) Топик (канал). По нему фронт будет понимать, какой это чат
        // Возьми любую понятную схему, главное — чтобы фронт подписывался на то же самое.
        $topic = sprintf(
            'https://qynso.local/chats/%s',
            (string) $chat->getId()     // если у тебя Uuid, можешь привести к строке как удобно
        );

        // 2) Что отправляем (payload)
        $data = [
            'type' => 'message_created',
            'chatId' => (string) $chat->getId(),
            'message' => [
                'id' => (string) $message->getId(),
                'senderId' => (string) $sender->getId(),
                'content' => $message->getContent(),
                'createdAt' => $message->getCreatedAt()->format(DATE_ATOM),
            ],
        ];

        // 3) Создаём Update
        $update = new Update(
            $topic,
            json_encode($data, JSON_THROW_ON_ERROR)
        );

        // 4) Отправляем в Mercure
        $this->hub->publish($update);
    }
}
