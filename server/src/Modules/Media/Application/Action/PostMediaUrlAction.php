<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Api\DTO\MediaItemDTO;
use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository\PostMediaBindingRepository;

final class PostMediaUrlAction
{
    public function __construct(
        private PostMediaBindingRepository $bindings,
        private GetMediaUrl $getMediaUrl,
    ) {}

    /** @return array<string, list<string>> */
    public function __invoke(array $postIds): array
    {
        $result = [];

         /** @var list<PostMediaBinding> $bindings */
        $bindings = $this->bindings->getMediasForPosts($postIds);

        foreach ($bindings as $binding) {
           $postId = (string) $binding->getPost()->getId();
           $result[$postId][] = new MediaItemDTO(
                id: (string) $binding->getMedia()->getId(),
                url: ($this->getMediaUrl)($binding->getMedia()),
                type: $binding->getMedia()->getFileType()->value,
                createdAt: $binding->getMedia()->getCreatedAt(),
                width: $binding->getMedia()->getWidth(),
                height: $binding->getMedia()->getHeight(),
                durationSeconds: $binding->getMedia()->getDurationSeconds(),
           );
        }

        return $result;
    }
}
