<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\DTO\PostMediaItem;
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
           $result[$postId][] = new PostMediaItem(
                id: (string) $binding->getMedia()->getId(),
                url: ($this->getMediaUrl)($binding->getMedia()),
                fileType: $binding->getMedia()->getFileType(),
                createdAt: $binding->getMedia()->getCreatedAt()->format(\DateTime::ATOM),
           );
        }

        return $result;
    }
}
