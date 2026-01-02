<?php

namespace App\Modules\User\Application\Action;

use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use App\Modules\User\Domain\Entity\UserAvatar;
use App\Modules\User\Domain\Repository\UserAvatarRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class UpdateUserAvatarAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private UserAvatarRepositoryInterface $userAvatars,
        private MediaAssetRepositoryInterface $mediaAssets,
    ) {}

    public function execute(Uuid $userId, string $originalFileId, string $previewFileId): void
    {

        $user = $this->users->findById($userId->toRfc4122());
        if ($user === null) {
            throw new \RuntimeException('User not found.');
        }

        $originaliFile = $this->mediaAssets->findById(Uuid::fromString($originalFileId));
        $previewFile = $this->mediaAssets->findById(Uuid::fromString($previewFileId));
        if ($originaliFile === null || $previewFile === null) {
            throw new \RuntimeException('Media asset not found.');
        }

        $userAvatar = (new UserAvatar())
            ->setUser($user)
            ->setOriginal($originaliFile)
            ->setPreview($previewFile);
            
        $user->setCurrentAvatar($userAvatar);
        $this->userAvatars->save($userAvatar);
    }
}
