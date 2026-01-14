<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\User\Application\Port\MediaServicePort;
use App\Modules\User\Domain\Repository\UserMediaBindingRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetUserMediaFileAction
{
    public function __construct(
        private MediaServicePort $mediaService,
        private UserMediaBindingRepositoryInterface $userMediaBindings,
    ) {}

    public function execute(Uuid $userId): array
    {
        $bindings = $this->userMediaBindings->findMediasByUserId($userId);
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
