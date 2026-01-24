<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Application\ReadModel\Chat\MessageResponseDTO;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final readonly class GetChatMessages
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function __invoke(
        Uuid $chatId,
        Uuid $userId,
        int $limit = 30,
        ?\DateTimeImmutable $dateFrom = null
    ): array {
        if ($this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]) === null) {
            throw new AccessDeniedException('You are not a participant of this chat.');
        }

        $data = $this->messageRepository->findMessagesByChatBefore(
            chatId: $chatId,
            limit: $limit,
            before: $dateFrom
        );

        $sendersIds = [];
        foreach ($data as $message) {
            $id = $message->getSender()->getId();
            $sendersIds[] = $id;
        }
        $sendersIds = array_values(array_unique($sendersIds));
        $sendersPreviews = $this->userDirectory->getPreviewsByIds($sendersIds);
        

        $messages = [];
        foreach ($data as $message) {
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
