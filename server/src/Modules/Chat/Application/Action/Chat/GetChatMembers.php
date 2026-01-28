<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChatMembers
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $participants,
        private readonly UserDirectoryInterface $userDirectory,
        private readonly ChatRepositoryInterface $chats,
    ) {
    }

    public function execute(Uuid $chatId, Uuid $userId, int $page, int $limit, ?string $search = null): array
    {
        $chat = $this->chats->findById($chatId);
        if ($chat === null) {
            throw new \LogicException('Chat not found');
        }

        $cp = $this->participants->findOneBy(['chat' => $chatId, 'user' => $userId]);
        if (!$cp) {
            throw new \LogicException('Access denied');
        }

        $membersWithRole = $this->participants->findAllUsersIdByChatId(chatId: $chatId, page: $page, limit: $limit, search: $search);
        $members = $this->userDirectory->getPreviewsByIds(array_map(
            fn(array $m) => Uuid::fromString($m['userId']),
            $membersWithRole
        ));

        $result = [];
        foreach ($membersWithRole as $member) {
            $result[] = [
                'id' => $member['userId'],
                'name' => $members[$member['userId']]->name,
                'avatarUrl' => $members[$member['userId']]->avatarUrl,
                'slug' => $members[$member['userId']]->slug,
                'role' => $member['role'],
            ];
        }

        return $result;
    }
}
