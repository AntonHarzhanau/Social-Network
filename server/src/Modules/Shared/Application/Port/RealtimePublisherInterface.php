<?php

namespace App\Modules\Shared\Application\Port;

interface RealtimePublisherInterface
{
    /**
     * @param string|list<string> $topics
     * @param array<string, mixed> $data
     */
    public function publish(string|array $topics, array $data, bool $private = true): void;
}
