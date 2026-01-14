<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\User\Application\Port\MediaServicePort;
use App\Modules\User\Domain\Entity\UserMediaBinding;
use App\Modules\User\Domain\Repository\UserMediaBindingRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class AttachMediaAction
{
    public function __construct(
        private readonly UserMediaBindingRepositoryInterface $userMediaBindingRepository,
        private readonly MediaServicePort $mediaService,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(Uuid $userId, array $mediaIds): Uuid
    {
        $user = $this->userRepository->findById($userId);
        $medias = $this->mediaService->getMediaAssetsByIds($mediaIds);

        foreach ($medias as $media) {
            $newBinding = (new UserMediaBinding())
                ->setOwner($user)
                ->setMedia($media);
            $this->userMediaBindingRepository->save($newBinding, false);
        }
        $this->userRepository->save($user, true);

        return $userId;
    }
}
