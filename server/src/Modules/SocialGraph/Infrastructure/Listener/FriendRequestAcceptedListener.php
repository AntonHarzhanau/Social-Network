<?php

namespace App\Modules\SocialGraph\Infrastructure\Listener;

use App\Modules\Notification\Application\Message\AcceptFriendRequestNotification;
use App\Modules\SocialGraph\Application\Event\FriendRequestAccepted;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsEventListener(event: FriendRequestAccepted::class)]

final class FriendRequestAcceptedListener
{
    public function __construct(private MessageBusInterface $bus)
    {
    }

    public function __invoke(FriendRequestAccepted $event): void
    {
        $this->bus->dispatch(new AcceptFriendRequestNotification(
            friendshipId: $event->friendshipId,
            requesterId: $event->requesterId,
            addresseeId: $event->addresseeId,
        ));
    }

}
