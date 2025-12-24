<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Application\Service\MessageService;
use Symfony\Component\Uid\Uuid;

final readonly class SendMessageToChatAction
{
    public function __construct(
        private readonly MessageService $messageService,
    ) {}

    public function __invoke(Uuid $chatId, Uuid $currentUserId, NewMessage $dto)
    {
        return $this->messageService->createMessage($chatId, $currentUserId, $dto->content);
    }
}
