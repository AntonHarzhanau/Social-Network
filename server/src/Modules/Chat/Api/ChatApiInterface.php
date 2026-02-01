<?php

namespace App\Modules\Chat\Api;

use Symfony\Component\Uid\Uuid;

interface ChatApiInterface
{
    public function getChatParticipants(Uuid $chatId, ?bool $includeMuted = null): array;

}
