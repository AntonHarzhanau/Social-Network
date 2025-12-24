<?php

namespace App\Modules\Shared\Infrastructure\Realtime;

use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

final readonly class MercureRealtimePublisher implements RealtimePublisherInterface
{
    public function __construct(private HubInterface $hub) {}

    public function publish(string|array $topics, array $data, bool $private = true): void
    {
        $update = new Update(
            $topics,
            json_encode($data, JSON_THROW_ON_ERROR),
            $private
        );

        $id = $this->hub->publish($update);
    }
}
