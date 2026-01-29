<?php

namespace App\Modules\Notification\Domain\Enum;

enum NotificationTypeEnum: string
{
    case FRIEND_REQUEST_CREATED = 'friend_request_created';
    case FRIEND_REQUEST_ACCEPTED = 'friend_request_accepted';
    case CHAT_MESSAGE = 'chat_message';
}
