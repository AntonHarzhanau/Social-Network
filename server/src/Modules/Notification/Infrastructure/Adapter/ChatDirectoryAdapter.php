<?php

namespace App\Modules\Notification\Infrastructure\Adapter;

use App\Modules\Chat\Api\ChatApiInterface;
use App\Modules\Notification\Application\Port\ChatParticipantsDirectoryInterface;
use Symfony\Component\Uid\Uuid;


final class ChatDirectoryAdapter implements ChatParticipantsDirectoryInterface
{
    public function __construct(
        private readonly ChatApiInterface $chatApi,
    ) {
    }

    /** @return list<Uuid> */
    public function getParticipantIds(Uuid $chatId): array
    {
        $members = $this->chatApi->getChatParticipants($chatId);
        
        $result = [];
        foreach ($members as $member) {
            $result[] = Uuid::fromString($member['userId']);
        }

        return $result;  
    }

    /** @return array{type: string, title: ?string} */
    public function getChatInfo(Uuid $chatId): array
    {
        return $this->chatApi->getChatInfo($chatId);
    }   
}
