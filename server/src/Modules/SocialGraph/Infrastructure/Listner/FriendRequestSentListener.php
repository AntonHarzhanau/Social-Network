<?php

namespace App\Modules\SocialGraph\Infrastructure\Listner;

use App\Modules\Notification\Application\Message\CreateFriendRequestNotification;
use App\Modules\SocialGraph\Application\Event\FriendRequestSent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsEventListener(event: FriendRequestSent::class)]

final class FriendRequestSentListener
{
    public function __construct(private MessageBusInterface $bus)
    {
    }

    public function __invoke(FriendRequestSent $event): void
    {
        $this->bus->dispatch(new CreateFriendRequestNotification(
            friendshipId: $event->friendshipId,
            requesterId: $event->requesterId,
            addresseeId: $event->addresseeId,
        ));
    }

}
