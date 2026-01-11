<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\DTO\MediaMutationResponse;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\Uid\Uuid;

final class LikeMediaAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaRepository,
        private readonly UserApiInterface $userApi,
    ) {}

    public function execute(Uuid $mediaId, Uuid $userId): array
    {
        $user = $this->userApi->findById($userId);
        $media = $this->mediaRepository->findById($mediaId);
        if ($media->getLikeBy()->contains($user)) {
            $media->getLikeBy()->removeElement($user);
            $media->setLikeCount($media->getLikeCount() - 1);
        } else {
            $media->getLikeBy()->add($user);
            $media->setLikeCount($media->getLikeCount() + 1);
        }

        $this->mediaRepository->save($media);

        return [
            "id" => $media->getId(),
            "likeCount" => $media->getLikeCount(),
            "likedByUser" => $media->getLikeBy()->contains($user),
        ];
    }
}
