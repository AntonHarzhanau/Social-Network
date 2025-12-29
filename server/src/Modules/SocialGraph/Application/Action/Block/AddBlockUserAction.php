<?php

namespace App\Modules\SocialGraph\Application\Action\Block;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Entity\UserBlock;
use App\Modules\SocialGraph\Domain\Repository\FriendshipRepositoryInterface;
use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class AddBlockUserAction
{
    public function __construct(
        private readonly UserBlockRepositoryInterface $userBlockRepository,
        private readonly FriendshipRepositoryInterface $friendshipRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(Uuid $userId, Uuid $currentUserId): void
    {
        if ($userId->equals($currentUserId)) {
            throw new \InvalidArgumentException('You cannot block yourself.');
        }
        $blocker = $this->userDirectory->getUser($currentUserId);
        $blocked = $this->userDirectory->getUser($userId);

        if (!$blocker || !$blocked) {
            throw new \InvalidArgumentException('User not found.');
        }

        $existingBlock = $this->userBlockRepository->findOneByBlockerAndBlocked($currentUserId, $userId);
        if ($existingBlock) {
            throw new \InvalidArgumentException('User is already blocked.');
        }

        $existingFriendship = $this->friendshipRepository->findFriendship($currentUserId, $userId);
        if ($existingFriendship){
            $this->friendshipRepository->remove($existingFriendship, false);
        }
        $newBlock = (new UserBlock())->setBlocker($blocker)->setBlocked($blocked);
        $this->userBlockRepository->save($newBlock);
        return;
    }
}
