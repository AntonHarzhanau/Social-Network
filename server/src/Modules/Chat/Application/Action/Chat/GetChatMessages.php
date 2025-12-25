<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Application\ReadModel\Chat\ChatDTOMapper;
use App\Modules\Chat\Application\ReadModel\Chat\ChatFactory;
use App\Modules\Chat\Domain\Repository\ChatParticipantRepositoryInterface;
use App\Modules\Chat\Domain\Repository\MessageRepositoryInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final readonly class GetChatMessages
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
        private readonly ChatParticipantRepositoryInterface $chatParticipantRepository,
        private readonly ChatDTOMapper $chatDTOMapper,
    ) {}

    public function __invoke(Uuid $chatId, Uuid $userId, int $page = 1, int $limit = 30): array
    {
        if ($this->chatParticipantRepository->findOneBy([
            'chat' => $chatId,
            'user' => $userId,
        ]) === null) {
            throw new AccessDeniedException('You are not a participant of this chat.');
        }

        $data = $this->messageRepository->findBy(
            [
                'chat' => $chatId,
            ],
            [
                'createdAt' => 'DESC',
            ],
            $limit,
            ($page - 1) * $limit
        );

        $messages = [];
        foreach ($data as $message) {
            $messages[] = [
                'id' => $message->getId(),
                'content' => $message->getContent(),
                'sender' => [
                    'id' => $message->getSender()->getId(),
                    'username' => $message->getSender()->getUsername(),
                    'avatarUrl' => $message->getSender()->getAvatarUrl(),
                ],
                'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return $messages;
    }
}
