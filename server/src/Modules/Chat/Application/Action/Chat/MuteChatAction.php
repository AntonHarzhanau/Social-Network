<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class MuteChatAction
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {
    }

    public function execute(Uuid $chatId, Uuid $userId): bool
    {
        $participant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]);
        if (!$participant) {
            throw new \RuntimeException('Chat participant not found');
        }

        $participant->setIsMuted(!$participant->isMuted());
        $this->chatParticipantRepository->save($participant);

        return $participant->isMuted();
    }
}
