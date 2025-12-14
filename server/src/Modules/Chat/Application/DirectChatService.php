<?php

namespace App\Modules\Chat\Application;

use App\Enum\ChatParticipantRoleEnum;
use App\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Entity\DirectChatIndex;
use App\Modules\Chat\Domain\Repository\DirectChatIndexRepositoryInterface;
use App\Modules\Identity\Domain\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;

class DirectChatService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly DirectChatIndexRepositoryInterface $directChatIndexRepository,
    ) {}


    public function getOrCreateDirectChat(User $current, User $other): Chat
    {
        if ($current->getId() === $other->getId()) {
            throw new \InvalidArgumentException('Cannot create direct chat with oneself.');
        }

        return $this->em->wrapInTransaction(function () use ($current, $other) {
            [$user1, $user2] = $this->sortUsers($current, $other);

            $index = $this->directChatIndexRepository->findByUsers($user1, $user2);

            if ($index) {
                return $index->getChat();
            }


            // participants
            $p1 = new ChatParticipant();

            $p1->setUser($user1);
            $p1->setRole(ChatParticipantRoleEnum::MEMBER);

            $p2 = new ChatParticipant();
            $p2->setUser($user2);
            $p2->setRole(ChatParticipantRoleEnum::MEMBER);

            $this->em->persist($p1);
            $this->em->persist($p2);

            $chat = new Chat();
            $chat->setType(ChatTypeEnum::DIRECT);
            $chat->setCreatedBy($current);
            $chat->addChatParticipant($p1);
            $chat->addChatParticipant($p2);

            $this->em->persist($chat);


            $index = new DirectChatIndex($user1, $user2, $chat);
            $this->em->persist($index);

            try {
                $this->em->flush();
                return $chat;
            } catch (UniqueConstraintViolationException $e) {
                $this->em->clear();

                $existingIndex = $this->directChatIndexRepository->findByUsers($user1, $user2);

                if ($existingIndex === null) {
                    throw $e;
                }

                return $existingIndex->getChat();
            }
        });
        return $chat;
    }

    private function sortUsers(User $userA, User $userB): array
    {
        $idA = $userA->getId();
        $idB = $userB->getId();

        if ($idA < $idB) {
            return [$userA, $userB];
        } else {
            return [$userB, $userA];
        }
    }
}
