<?php

namespace App\Modules\Shared\Application\Port;

interface EventBusInterface
{
    public function dispatch(object $event): void;
}
