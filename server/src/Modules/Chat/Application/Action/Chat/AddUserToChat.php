<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Shared\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Shared\Domain\Enum\ChatTypeEnum;
use Symfony\Component\Uid\Uuid;;

final class AddUserToChat
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function __invoke(array $newParticipantsIds, Uuid $chatId, Uuid $currentUserId): void
    {
        $chat = $this->chatRepository->findById($chatId);
        if (!$chat) {
            throw new \DomainException('Chat not found');
        }

        if ($chat->getType() !== ChatTypeEnum::GROUP) {
            throw new \DomainException('Cannot add users to a non-group chat');
        }

        $chatParticipant = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $currentUserId,
        ]);

        if (!$chatParticipant) {
            throw new \DomainException('Current user is not a participant of the chat');
        }

        $newParticipants = $this->userDirectory->findManyByIds($newParticipantsIds);

        $usersInChat = $this->chatParticipantRepository->getAllUsersByChatId($chat);
        $existingUserIds = [];
        foreach ($usersInChat as $userInChat) {
            $existingUserIds[] = $userInChat->getUser()->getId();
        }

        foreach ($newParticipants as $participant) {
            if (in_array($participant->getId(), $existingUserIds, true)) {
                continue; // Skip users already in the chat
            }

            $chat->addChatParticipant(
                (new ChatParticipant())
                    ->setUser($participant)
                    ->setChat($chat)
                    ->setRole(ChatParticipantRoleEnum::MEMBER)
            );

            $this->chatRepository->save($chat);
        }
    }
}
