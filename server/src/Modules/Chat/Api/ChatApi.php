<?php

namespace App\Modules\Chat\Api;

use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ChatApi implements ChatApiInterface
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {
    }

    public function getChatParticipants(Uuid $chatId, ?bool $includeMuted = false): array
    {

        return $this->chatParticipantRepository->findAllUsersIdByChatId($chatId, includeDeleted: false, isMuted: $includeMuted);
    }
}
