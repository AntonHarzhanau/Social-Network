<?php

namespace App\Modules\Shared\Infrastructure\Realtime;

use App\Modules\Shared\Application\Message\PublishRealTimeUpdate;
use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use Symfony\Component\Messenger\MessageBusInterface;

final readonly class MessengerRealtimePublisher implements RealtimePublisherInterface
{
    public function __construct(private MessageBusInterface $bus) {}

    public function publish(string|array $topics, array $data, bool $private = true): void
    {
        $this->bus->dispatch(new PublishRealTimeUpdate($topics, $data, $private));
    }
}
