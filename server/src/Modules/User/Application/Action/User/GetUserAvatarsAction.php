<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\User\Application\Port\MediaServicePort;
use App\Modules\User\Domain\Repository\UserAvatarRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetUserAvatarsAction
{
    public function __construct(
        private readonly UserAvatarRepositoryInterface $avatarRepository,
        private readonly MediaServicePort $mediaService,
    ) {}

    public function execute(Uuid $userId, Uuid $currentUserId): ?array
    {
        // TODO: check if currentUserId in blacklist of userId
        $avatars = $this->avatarRepository->findManyByOwnerId($userId);
        if (empty($avatars)) {
            return null;
        }
        $mediaIds = array_map(fn($avatar) => $avatar->getOriginal()->getId(), $avatars);
        $avatars = $this->mediaService->getMediasByIds($mediaIds);
        usort($avatars, fn($a, $b) => $b->createdAt <=> $a->createdAt);
        return $avatars;
    }
}
