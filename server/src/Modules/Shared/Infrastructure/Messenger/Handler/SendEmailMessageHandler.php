<?php

namespace App\Modules\Shared\Infrastructure\Messenger\Handler;

use App\Modules\Shared\Application\Message\SendEmailMessage;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Email;

#[AsMessageHandler]
final readonly class SendEmailMessageHandler
{
    public function __construct(
        private MailerInterface $mailer,
        #[Autowire(env: 'MAIL_FROM')]
        private string $mailFrom,
    ) {
    }

    public function __invoke(SendEmailMessage $message): void
    {
        $email = (new Email())
            ->from($this->mailFrom)
            ->to(...$message->to)
            ->subject($message->subject)
            ->html($message->body);


        $this->mailer->send($email);

    }
}
