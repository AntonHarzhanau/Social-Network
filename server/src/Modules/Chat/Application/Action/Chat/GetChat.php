<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\DTO\ChatListItemDTO;
use App\Modules\Chat\Application\ReadModel\Chat\ChatListAssembler;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChat
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly ChatListAssembler $chatListAssembler,
    ) {
    }

    public function __invoke(Uuid $chatId, Uuid $userId): ?ChatListItemDTO
    {
        $chatParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]);

        if (!$chatParticipant) {
            throw new \LogicException('You are not a participant of this chat.');
        }

        if ($chatParticipant->getChat()->getType() === ChatTypeEnum::GROUP && $chatParticipant->getDeletedAt() !== null) {
            throw new \LogicException('You are not a participant of this chat.');
        }

        $chat = $this->chatRepository->findUserChatRowById($userId, $chatId);

        return $this->chatListAssembler->assemble($userId, [$chat])[0];
    }
}
