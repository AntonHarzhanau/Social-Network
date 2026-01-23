<?php

namespace App\Modules\Shared\Infrastructure\Realtime;

final class Topics
{
    public static function chat(string $chatId): string
    {
        return \sprintf('https://social-network.local/chats/%s', $chatId);
    }

    public static function userNotifications(string $userId): string
    {
        return \sprintf('https://social-network.local/users/%s/notifications', $userId);
    }
}
