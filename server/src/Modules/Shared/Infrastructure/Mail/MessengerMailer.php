<?php

namespace App\Modules\Shared\Infrastructure\Mail;

use App\Modules\Shared\Application\Message\SendEmailMessage;
use App\Modules\Shared\Application\Port\EmailSenderInterface;
use Symfony\Component\Messenger\MessageBusInterface;

final readonly class MessengerMailer implements EmailSenderInterface
{
    public function __construct(
        private MessageBusInterface $bus
    ) {}

    public function send(SendEmailMessage $email): void
    {
        $this->bus->dispatch($email);
    }
}
