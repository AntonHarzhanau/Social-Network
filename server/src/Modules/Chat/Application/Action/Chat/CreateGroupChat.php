<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Entity\Chat;
use App\Modules\Chat\Domain\Entity\ChatParticipant;
use App\Modules\Chat\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class CreateGroupChat
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly ChatRepositoryInterface $chatRepository,

    ) {}

    public function __invoke(
        Uuid $creatorId,
        string $title,
        ?string $avatarUrl = null,
        array $participantIds,
    ): string {

        $participantIds = array_filter($participantIds, fn($id) => $id !== $creatorId);

        $creator = $this->userDirectory->findById($creatorId);
        $participants = $this->userDirectory->findManyByIds($participantIds);

        $chatCreator = (new ChatParticipant())
            ->setUser($creator)
            ->setRole(ChatParticipantRoleEnum::OWNER);

        $chat = (new Chat())
            ->setTitle($title)
            ->setAvatarUrl($avatarUrl)
            ->setType(ChatTypeEnum::GROUP)
            ->setCreatedBy($creator)
            ->addChatParticipant($chatCreator);

        foreach ($participants as $participant) {
            $chatParticipant = (new ChatParticipant())
                ->setUser($participant)
                ->setRole(ChatParticipantRoleEnum::MEMBER);
            $chat->addChatParticipant($chatParticipant);
        }

        $this->chatRepository->save($chat);

        return (string) $chat->getId();
    }
}
