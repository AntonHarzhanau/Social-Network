<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\Action\Command\CreatePostCommand;
use App\Modules\Feed\Application\DTO\PostMutationResponse;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Application\Port\UserDirectoryInterface;
use App\Modules\Feed\Application\Service\PostMediaBindingsService;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\Feed\Domain\Repository\WallRepositoryInterface;

final class CreatePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly UserDirectoryInterface $userDirectory,
        private readonly WallRepositoryInterface $wallRepository,
        private readonly PostMediaBindingsService $postMediaBindingsService,
        private readonly GroupDirectoryInterface $groupDirectory,
    ) {}

    public function execute(CreatePostCommand $command): PostMutationResponse
    {
        
        $author = $this->userDirectory->getUser($command->authorId->toRfc4122());

        if ($author === null) {
            throw new \RuntimeException('Author not found');
        }
        $wall = $this->wallRepository->getWallById($command->wallId);
        if ($wall === null) {
            throw new \RuntimeException('Wall not found');
        }

        $canPost = false;
        if ($wall->getOwnerType() === WallOwnerTypeEnum::USER) {
            $canPost = $wall->getId()->equals($author->getWall()->getId());
        } else {
            $groupWallIds = $this->groupDirectory->findGroupWallIdsByUserId($author->getId());
            $canPost = \in_array($wall->getId()->toRfc4122(), $groupWallIds, true);
        }

        if (!$canPost) {
            throw new \RuntimeException('User cannot post on this wall');
        }

        $post = new Post();
        $post->setAuthor($author);
        $post->setContent($command->content);
        if ($command->visibility !== null) {
            $post->setVisibility($command->visibility);
        }
        $this->postRepository->save($post, false);
        $this->postMediaBindingsService->addMediaToPost($command->mediaIds ?? [], $post);
        $wall->addPost($post);

        $this->wallRepository->save($wall, true);

        return new PostMutationResponse($post->getId()->toRfc4122());
    }
}
