<?php

namespace App\Modules\Notification\Domain\Entity;

enum NotificationTypeEnum: string
{
    case FRIEND_REQUEST_CREATED = 'FRIEND_REQUEST_CREATED';
    case FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED';
    case CHAT_MESSAGE = 'CHAT_MESSAGE';
}
