<?php

namespace App\Modules\Notification\Application\Port;

use Symfony\Component\Uid\Uuid;

interface ChatParticipantsDirectoryInterface
{
    /** @return list<Uuid> */
    public function getParticipantIds(Uuid $chatId): array;

    /** @return array{type: string, title: ?string} */
    public function getChatInfo(Uuid $chatId): array;
}
