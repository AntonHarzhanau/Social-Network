<?php

namespace App\Modules\Shared\Infrastructure\Realtime;

final class Topics
{
    public static function chat(string $chatId): string
    {
        return sprintf('https://qynso.local/chats/%s', $chatId);
    }

    public static function userNotifications(string $userId): string
    {
        return sprintf('https://qynso.local/users/%s/notifications', $userId);
    }
}
