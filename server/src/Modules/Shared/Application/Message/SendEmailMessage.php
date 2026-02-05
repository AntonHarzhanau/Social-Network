<?php

namespace App\Modules\Shared\Application\Message;

final readonly class SendEmailMessage
{

    /**
     * @param list<string> $to
     */
    public function __construct(
        public array $to,
        public string $subject,
        public string $body,
    ) {}
}
