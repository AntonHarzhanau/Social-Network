<?php

namespace App\Modules\Chat\Application\Service;

use App\Enum\ChatParticipantRoleEnum;
use App\Enum\ChatTypeEnum;
use App\Modules\Chat\Application\Action\Exception\DirectChatAlreadyExists;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Entity\DirectChat;
use App\Modules\Chat\Domain\Repository\DirectChatRepositoryInterface;
use App\Modules\User\Domain\Entity\User;

class DirectChatService
{
    public function __construct(
        private readonly DirectChatRepositoryInterface $directChatRepository,
    ) {}

    public function getOrCreateDirectChat(User $currentUser, User $otherUser): Chat
    {
        if ($currentUser->getId()->equals($otherUser->getId())) {
            throw new \InvalidArgumentException('Cannot create direct chat with oneself.');
        }

        [$user1, $user2] = $this->sortUsers($currentUser, $otherUser);

        $existing = $this->directChatRepository->findByUsers($user1->getId(), $user2->getId());

        if ($existing) {
            return $existing->getChat();
        }

        $chat = $this->createDirectChat($currentUser, $otherUser);
        $index = new DirectChat($user1, $user2, $chat);

        try {
            $this->directChatRepository->save($index);
            return $chat;
        } catch (DirectChatAlreadyExists) {

            $existing = $this->directChatRepository->findByUsers($user1, $user2)->getChat();

            if (!$existing) {
                throw new \RuntimeException('Direct chat was not found after UniqueConstraintViolationException.');
            }
            return $existing;
        }
    }

    private function createDirectChat(User $currentUser, User $otherUser): Chat
    {
        $p1 = (new ChatParticipant())->setUser($currentUser)->setRole(ChatParticipantRoleEnum::MEMBER);

        $p2 = (new ChatParticipant())->setUser($otherUser)->setRole(ChatParticipantRoleEnum::MEMBER);

        $chat = (new Chat())
            ->setType(ChatTypeEnum::DIRECT)
            ->setCreatedBy($currentUser)
            ->addChatParticipant($p1)
            ->addChatParticipant($p2);
        return $chat;
    }

    private function sortUsers(User $userA, User $userB): array
    {
        return strcmp($userA->getId()->toRfc4122(), $userB->getId()->toRfc4122()) < 0
            ? [$userA, $userB]
            : [$userB, $userA];
    }
}
