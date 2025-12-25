<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Port\MediaAssetDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Shared\Domain\Enum\VisibilityEnum;
use Symfony\Component\Uid\Uuid;

final class CreatePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly MediaAssetDirectoryInterface $mediaAssetDirectory,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function __invoke(?string $content, array $mediaIds, Uuid $authorId, VisibilityEnum $visibility): void
    {
        $post = new Post();
        $author = $this->userDirectory->getUser($authorId->toRfc4122());
        $post->setAuthor($author);
        $post->setContent($content);
        if ($visibility !== null) {
            $post->setVisibility($visibility);
        }

        $this->postRepository->save($post);


        $this->mediaAssetDirectory->addMediaToPost($mediaIds ?? [], $post->getId());
    }
}
