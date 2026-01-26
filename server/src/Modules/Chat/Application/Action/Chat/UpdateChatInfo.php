<?php

namespace App\Modules\Chat\Application\Action\Chat;

use App\Modules\Chat\Domain\Enum\ChatTypeEnum;
use App\Modules\Chat\Domain\Repository\ChatRepositoryInterface;
use App\Modules\Media\Api\MediaApiInterface;
use Symfony\Component\Uid\Uuid;

final class UpdateChatInfo
{
    public function __construct(
        private readonly ChatRepositoryInterface $chatRepository,
        private readonly MediaApiInterface $mediaApi,
    ) {
    }

    public function execute(Uuid $chatId, Uuid $userId, ?Uuid $newMediaId, ?string $newChatName): void
    {
        $chat = $this->chatRepository->findById($chatId);
        if ($chat === null) {
            throw new \RuntimeException('Chat not found');
        }

        if ($chat->getType() !== ChatTypeEnum::GROUP) {
            throw new \RuntimeException('Cannot update private chat');
        }
        
        if (!$chat->getCreatedBy()->getId()->equals($userId)) {
            throw new \RuntimeException('Access denied');
        }

        if ($newMediaId !== null) {
            $media = $this->mediaApi->getMediasByIds(null, [$newMediaId])[0] ?? null;
            if ($media === null) {
                throw new \RuntimeException('Media not found');
            }
            $chat->setAvatarUrl($media->url());
        }

        if ($newChatName !== null) {
            $chat->setTitle($newChatName);
        }
        $this->chatRepository->save($chat);
    }
}
