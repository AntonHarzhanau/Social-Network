<?php

namespace App\Modules\Notification\Infrastructure\Messenger\Handler;

use App\Modules\Notification\Application\Message\AcceptFriendRequestNotification;
use App\Modules\Notification\Application\Port\UserDirectioryInterface;
use App\Modules\Notification\Domain\Entity\Notification;
use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;
use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use App\Modules\Shared\Infrastructure\Realtime\Topics;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class AcceptFriendRequestNotificationHandler
{
    public function __construct(
        private NotificationRepositoryInterface $notifications,
        private UserDirectioryInterface $users,
        private RealtimePublisherInterface $realtime,
    ) {
    }

    public function __invoke(AcceptFriendRequestNotification $message): void
    {
        $requester = $this->users->getUser($message->requesterId);
        $addressee = $this->users->getUser($message->addresseeId);

        if (!$requester || !$addressee) {
            return;
        }

        $text = \sprintf(
            '%s has accepted your friend request.',
            $addressee->getUsername()
        );

        $notification = new Notification(
            recipient: $requester,
            type: NotificationTypeEnum::FRIEND_REQUEST_ACCEPTED,
            text: $text,
            target: ['kind' => 'friend_accepts'],
            payload: [
                'friendshipId' => $message->friendshipId->toRfc4122(),
                'requesterId' => $addressee->getId()->toRfc4122(),
            ],
            actor: $addressee,
            groupKey: null,
        );

        $this->notifications->save($notification);

        $recipientId = $message->requesterId->toRfc4122();

        $unreadCount = $this->notifications->countUnread($message->requesterId);

        $this->realtime->publish(
            Topics::userNotifications($recipientId),
            [
                'type' => 'notification_created',
                'notification' => [
                    'id' => $notification->getId()->toRfc4122(),
                    'type' => $notification->getType()->value,
                    'text' => $notification->getText(),
                    'target' => $notification->getTarget(),
                    'payload' => $notification->getPayload(),
                    'createdAt' => $notification->getCreatedAt()->format(DATE_ATOM),
                    
                ],
                'unreadCount' => $unreadCount,
            ],
            private: false, 
        );
    }
}
