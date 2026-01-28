<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ChangeMemberRole
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
    ) {}

    public function execute(
        Uuid $chatId,
        Uuid $userId,
        Uuid $currentUserId,
        string $newRole
    ): void {
        if ($userId->equals($currentUserId)) {
            throw new \DomainException('Users cannot change their own roles');
        }

        $target = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]);
        if (!$target) {
            throw new \DomainException('User is not a participant of the chat');
        }

        $actor = $this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $currentUserId,
        ]);
        if (!$actor) {
            throw new \DomainException('Current user is not a participant of the chat');
        }

        $actorRole  = $actor->getRole();
        $targetRole = $target->getRole();

        if ($targetRole === ChatParticipantRoleEnum::OWNER) {
            throw new \DomainException('Cannot change role of the chat owner');
        }

        if ($actorRole === ChatParticipantRoleEnum::MEMBER) {
            throw new \DomainException('Current user does not have permission to change member roles');
        }

        $role = ChatParticipantRoleEnum::tryFrom($newRole);
        if (!$role) {
            throw new \DomainException('Invalid role');
        }

        if ($role === ChatParticipantRoleEnum::OWNER) {
            throw new \DomainException('Cannot assign owner role');
        }

        $target->setRole($role);
        $this->chatParticipantRepository->save($target);
    }
}

