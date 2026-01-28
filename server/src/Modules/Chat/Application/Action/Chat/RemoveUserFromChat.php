<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class RemoveUserFromChat
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {
    }

    public function __invoke(Uuid $currentUserId, Uuid $userToRemoveId, Uuid $chatId): void
    {
        $chat = $this->chatRepository->findById($chatId);
        if (!$chat) {
            throw new \RuntimeException('Chat not found.');
        }

        $currentUserParticipant = $this->chatParticipantRepository->findOneBy([
            'user' => $currentUserId,
            'chat' => $chatId,
        ]);

        if ($currentUserParticipant === null) {
            throw new \RuntimeException('Current user is not a participant of the chat.');
        }

        if ($chat->getType() === ChatTypeEnum::SELF) {
            return;
        }

        if ($currentUserId->equals($userToRemoveId)) {

            $currentUserParticipant->setDeletedAt(new \DateTimeImmutable());

            if ($chat->getType() === ChatTypeEnum::DIRECT) {
                $currentUserParticipant->setLastReadAt(new \DateTimeImmutable());
                $currentUserParticipant->setLastReadMessage($chat->getLastMessage());
            }

            $this->chatParticipantRepository->save($currentUserParticipant);
            return;
        }

        if ($chat->getType() !== ChatTypeEnum::GROUP) {
            throw new \RuntimeException('Cannot remove other user from non-group chat.');
        }

        if (($currentUserParticipant->getRole() === ChatParticipantRoleEnum::MEMBER)) {
            throw new \RuntimeException('Only admins can remove users from the chat.');
        }

        $participantToRemove = $this->chatParticipantRepository->findOneBy([
            'user' => $userToRemoveId,
            'chat' => $chatId,
        ]);

        if ($participantToRemove === null || $participantToRemove->getDeletedAt() !== null) {
            throw new \RuntimeException('User is not an active participant of the chat.');
        }

        if ($participantToRemove->getRole() === ChatParticipantRoleEnum::OWNER) {
            throw new \RuntimeException('Cannot remove the owner of the chat.');
        }

        $participantToRemove->setDeletedAt(new \DateTimeImmutable());
        $this->chatParticipantRepository->save($participantToRemove);
    }

}
