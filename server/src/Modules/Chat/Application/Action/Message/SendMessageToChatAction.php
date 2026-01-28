<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Application\Service\MessageService;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final readonly class SendMessageToChatAction
{
    public function __construct(
        private readonly MessageService $messageService,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {
    }

    public function __invoke(Uuid $chatId, Uuid $currentUserId, NewMessage $dto)
    {
        $chatParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $currentUserId,
        ]);

        if (!$chatParticipant) {
            throw new \LogicException('User is not a participant of the chat.');
        }

        return $this->messageService->createMessage($chatId, $currentUserId, $dto->content);
    }
}
