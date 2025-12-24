<?php

namespace App\Modules\Shared\Infrastructure\Messenger\Handler;

use App\Modules\Shared\Application\Message\PublishRealTimeUpdate;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final readonly class PublishRealTimeUpdateHandler
{
    public function __construct(private HubInterface $hub) {}

    public function __invoke(PublishRealTimeUpdate $message) 
    {
        $update = new Update(
            $message->topics,
            json_encode($message->data),
            private: $message->private,
        );

        $this->hub->publish($update);
    }
}
