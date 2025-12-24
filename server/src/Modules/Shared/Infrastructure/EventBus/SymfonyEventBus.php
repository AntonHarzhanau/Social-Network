<?php

namespace App\Modules\Shared\Infrastructure\EventBus;

use App\Modules\Shared\Application\Port\EventBusInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

final readonly class SymfonyEventBus implements EventBusInterface
{
    public function __construct(
        private EventDispatcherInterface $dispatcher
    ) {}

    public function dispatch(object $event): void
    {
        $this->dispatcher->dispatch($event);
    }
}
