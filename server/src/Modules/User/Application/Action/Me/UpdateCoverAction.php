<?php

namespace App\Modules\User\Application\Action\Me;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class UpdateCoverAction
{
    public function __construct(
        private UserRepositoryInterface $users,
        private MediaApiInterface $mediaApi,
        private GetMediaUrl $getMediaUrl,
    ) {}

    public function execute(Uuid $userId, ?string $imageId): void
    {

        $user = $this->users->findById($userId->toRfc4122());
        if ($user === null) {
            throw new \RuntimeException('User not found.');
        }
            if ($imageId === null) {
                $user->setCoverUrl(null);
                $this->users->save($user);
                return;
            }

        $imageAsset = $this->mediaApi->getMediaAssetById(Uuid::fromString($imageId));
        if ($imageAsset === null) {
            throw new \DomainException('Media asset not found.');
        }


        $user->setCoverUrl(($this->getMediaUrl)($imageAsset->getStorageKey()));
        $this->users->save($user);
    }
}
