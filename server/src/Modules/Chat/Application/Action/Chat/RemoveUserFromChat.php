<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class RemoveUserFromChat
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {}

    public function __invoke(Uuid $currentUserId, Uuid $userToRemoveId, Uuid $chatId): void
    {
        $userToRemove = $this->userDirectory->findById($userToRemoveId);

        $currentUserParticipant = $this->chatParticipantRepository->findOneBy([
            'user' => $currentUserId,
            'chat' => $chatId,
        ]);
        
        if ($currentUserParticipant === null || $currentUserParticipant->getRole() !== ChatParticipantRoleEnum::ADMIN) {
            throw new \RuntimeException('Only admins can remove users from the chat.');
        }

        $participantToRemove = $this->chatParticipantRepository->findOneBy([
            'user' => $userToRemove->getId(),
            'chat' => $chatId,
        ]);

        if ($participantToRemove === null) {
            throw new \RuntimeException('User is not a participant of the chat.');
        }

        if ($participantToRemove->getRole() === ChatParticipantRoleEnum::OWNER) {
            throw new \RuntimeException('Cannot remove the owner of the chat.');
        }

        // TODO: Add additional checks 

        $this->chatParticipantRepository->delete($participantToRemove);
        
    }
}
