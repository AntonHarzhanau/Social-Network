<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Application\ReadModel\Chat\MessageResponseDTO;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetChatMessages
{
    public function __construct(
        private readonly ChatParticipantRepositoryInterface $participants,
        private readonly MessageRepositoryInterface $messages,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(
        Uuid $chatId,
        Uuid $userId,
        string $mode,     // latest|before|after|around
        ?Uuid $messageId,
        int $limit,
    ): array {
        $this->assertMember($chatId, $userId);

        if ($mode === 'latest' || $messageId === null) {
            $entities = $this->messages->findLatest($chatId, $limit);
            return $this->messageResponseMapper($entities);
        }

        $anchor = $this->messages->findOneBy(['chat' => $chatId, 'id' => $messageId]);
        if ($anchor === null) {
            return [];
        }

        $cursorAt = $anchor->getCreatedAt();
        $cursorId = $anchor->getId();


        if ($mode === 'before' || $mode === 'after') {
            $entities = $this->messages->findByCursor($chatId, $cursorAt, $cursorId, $limit, $mode);
            return $this->messageResponseMapper($entities);
        }

        $before = $this->messages->findByCursor($chatId, $cursorAt, $cursorId, $limit, 'before');
        $after  = $this->messages->findByCursor($chatId, $cursorAt, $cursorId, $limit, 'after');

        $entities = array_merge($before, [$anchor], $after);

        return $this->messageResponseMapper($entities);
    }

    private function assertMember(Uuid $chatId, Uuid $userId): void
    {
        $cp = $this->participants->findOneBy(['chat' => $chatId, 'user' => $userId]);
        if (!$cp) {
            throw new \LogicException('Access denied');
        }
    }

    private function messageResponseMapper(array $entities): array
    {
        $sendersIds = [];
        foreach ($entities as $message) {
            $id = $message->getSender()->getId();
            $sendersIds[] = $id;
        }
        $sendersIds = array_values(array_unique($sendersIds));
        $sendersPreviews = $this->userDirectory->getPreviewsByIds($sendersIds);
        

        $messages = [];
        foreach ($entities as $message) {
            $sender = $sendersPreviews[$message->getSender()->getId()->toRfc4122()];
            $messages[] = new MessageResponseDTO(
                id: (string) $message->getId(),
                content: $message->getContent(),
                sender: [
                    'id' => $sender->id,
                    'name' => $sender->name,
                    'avatarUrl' => $sender->avatarUrl,
                ],
                createdAt: $message->getCreatedAt()->format(\DateTime::ATOM),
            );
        }

        return $messages;
    }
}
