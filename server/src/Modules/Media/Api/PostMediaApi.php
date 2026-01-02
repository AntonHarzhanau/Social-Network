<?php

namespace App\Modules\Media\Api;

use App\Modules\Media\Application\Action\PostMediaUrlAction;
use App\Modules\Media\Infrastructure\Persistence\Doctrine\Repository\PostMediaBindingRepository;
use Symfony\Component\Uid\Uuid;

class PostMediaApi implements PostMediaApiInterface
{
    public function __construct(
       private readonly PostMediaUrlAction $postMediaUrlAction,
       private readonly PostMediaBindingRepository $postMediaBindingRepository,
    ) {}

    public function addMediaToPost(array $mediaIds, Uuid $post): void
    {
        $this->postMediaBindingRepository->addMediaToPost($mediaIds, $post);
    }

    public function removeMediaFromPost(array $mediaIds, Uuid $post): void
    {
        $this->postMediaBindingRepository->removeMediaFromPost($mediaIds, $post);
    }

    public function getMediasForPosts(array $postIds): array
    {   
        $postMedias = ($this->postMediaUrlAction)($postIds);
        return $postMedias;
    }
}
