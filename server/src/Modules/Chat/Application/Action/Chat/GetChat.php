<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\ReadModel\Chat\ChatDTOMapper;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final class GetChat
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly ChatDTOMapper $chatDTOMapper,
    ) {}

    public function __invoke(Uuid $chatId, Uuid $userId): array
    {
        $chatParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]);

        if (!$chatParticipant) {
            throw new AccessDeniedException('You are not a participant of this chat.');
        }

        $chat = $chatParticipant->getChat();

        return $this->chatDTOMapper->toChatResponseDTO($chat, $userId);
    }
}
