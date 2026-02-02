<?php

namespace App\Modules\Feed\Application\Action;

use App\Modules\Feed\Application\DTO\PostMutationResponse;
use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Feed\Domain\Enum\WallOwnerTypeEnum;
use App\Modules\Feed\Domain\Repository\PostRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

final class DeletePostAction
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository,
        private readonly GroupDirectoryInterface $groupDirectory
    ) {}

    public function execute(Uuid $postId, User $user): PostMutationResponse
    {

        $post = $this->postRepository->findOneById($postId);
        if (!$post) {
            throw new NotFoundHttpException('Post not found.');
        }

        $postOwnerType = $post->getWall()->getOwnerType();

        $canDelete = false;

        if ($postOwnerType === WallOwnerTypeEnum::USER) {
            $canDelete = $post->getWall()->getId()->equals($user->getWall()->getId());
        } else {
            $group = $this->groupDirectory->findPreviewsByWallIds($user->getId(), [$post->getWall()->getId()]) [0] ?? null;
            if ($group) {
                $userRole = $this->groupDirectory->getUserRole(Uuid::fromString($group->id), $user->getId());
                $canDelete = \in_array($userRole, ['admin', 'owner'], true);
            }
        }

        if (!$canDelete) {
            throw new AccessDeniedException('You do not have permission to delete this post.');
        }

        $this->postRepository->remove($post);

        return new PostMutationResponse($postId);
    }
}
