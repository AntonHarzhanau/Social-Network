<?php

namespace App\Modules\SocialGraph\Infrastructure\Notification;

use App\Modules\Shared\Application\Message\UpsertNotification;
use App\Modules\Shared\Application\Notification\NotificationTypes;
use App\Modules\SocialGraph\Application\Event\FriendRequestAccepted;
use App\Modules\SocialGraph\Application\Event\FriendRequestSent;
use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;

final class FriendshipNotificationProducer implements EventSubscriberInterface
{
    public function __construct(
        private readonly MessageBusInterface $messageBus,
        private readonly UserDirectoryInterface $userDirectory,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            FriendRequestSent::class => 'onSent',
            FriendRequestAccepted::class => 'onAccepted',
        ];
    }

    public function onSent(FriendRequestSent $event): void
    {
        $requesterId = $event->requesterId->toRfc4122();
        $addresseeId = $event->addresseeId->toRfc4122();

        $actor = $this->userDirectory->findPreviewsByIds([$requesterId])[0] ?? null;

        if (!$actor) {
            return;
        }

        $payload = [
            'source' => [
                'kind' => 'user',
                'id' => $actor->id,
                'name' => $actor->name,
                'avatarUrl' => $actor->avatarUrl,
                'slug' => $actor->slug,
            ],
            'friendshipId' => $event->friendshipId->toRfc4122(),
            'requesterId' => $requesterId,
            'addresseeId' => $addresseeId,
        ];

        $this->messageBus->dispatch(new UpsertNotification(
            type: NotificationTypes::FRIEND_REQUEST_CREATED,
            recipientsIds: [$addresseeId],
            text: \sprintf('%s has sent you a friend request.', $actor->name),
            payload: $payload,
            groupKey: null,
            aggregate: false,
            private: false,
        ));

    }

    public function onAccepted(FriendRequestAccepted $event): void
    {
        $requesterId = $event->requesterId->toRfc4122();
        $addresseeId = $event->addresseeId->toRfc4122();

        $actor = $this->userDirectory->findPreviewsByIds([$addresseeId])[0] ?? null;

        if (!$actor) {
            return;
        }

        $payload = [
            'source' => [
                'kind' => 'user',
                'id' => $actor->id,
                'name' => $actor->name,
                'avatarUrl' => $actor->avatarUrl,
                'slug' => $actor->slug,
            ],
            'friendshipId' => $event->friendshipId->toRfc4122(),
            'requesterId' => $requesterId,
            'addresseeId' => $addresseeId,
        ];

        $this->messageBus->dispatch(new UpsertNotification(
            type: NotificationTypes::FRIEND_REQUEST_ACCEPTED,
            recipientsIds: [$requesterId],
            text: \sprintf('%s has accepted your friend request.', $actor->name),
            payload: $payload,
            groupKey: null,
            aggregate: false,
            private: false,
        ));
    }
}

