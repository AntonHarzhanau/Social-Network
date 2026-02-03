<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\Media\Domain\Enum\FileTypeEnum;
use App\Modules\User\Application\Port\MediaServicePort;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Enum\ProfileVisibilityEnum;
use App\Modules\User\Domain\Repository\UserMediaBindingRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetUserMediaFileAction
{
    public function __construct(
        private MediaServicePort $mediaService,
        private UserMediaBindingRepositoryInterface $userMediaBindings,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(Uuid $userId, User $currentUser, FileTypeEnum $fileType): array
    {
        $user = $this->userRepository->findOneBy(['id' => $userId]);
        if ($user === null) {
            throw new \LogicException('User not found');
        }
        $canViewMedia = false;
        if ($user->getPrivacySettings()->getMediaVisibility() === ProfileVisibilityEnum::PRIVATE && 
            $user->getId() !== $currentUser->getId()) {
            $canViewMedia = false;
        } else {
            $canViewMedia = true;

        }

        if (!$canViewMedia) {
            return [];
        }

        $bindings = $this->userMediaBindings->findMediasByUserId($userId, $fileType);
        $mediaIds = array_map(fn($binding) => $binding->getId(), $bindings);
        $medias = $this->mediaService->getMediasByIds(null, $mediaIds);
        
        $response = [];
        foreach ($medias as $media) {
            $response[] = [
                'id' => $media->id,
                'url' => $media->url,
                'type' => $media->type,
                'width' => $media->width,
                'height' => $media->height,
                'durationSeconds' => $media->durationSeconds,
            ];
        };

        return $response;
    }
}
