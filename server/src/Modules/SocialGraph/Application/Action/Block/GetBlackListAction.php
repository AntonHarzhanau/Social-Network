<?php

namespace App\Modules\SocialGraph\Application\Action\Block;

use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetBlackListAction
{
    public function __construct(
        private readonly UserBlockRepositoryInterface $userBlockRepository,
    ) {}

    public function execute(Uuid $currentUserId, int $page, int $limit): array
    {
        $blocks = $this->userBlockRepository->findAllBlocksByBlockerId($currentUserId, $page, $limit);

        $blockedUsers = [];
        foreach ($blocks as $block) {
            // dd($block);
            $blockedUsers[] = [
                'id' => $block['id'],
                'username' => $block['username'],
                'avatarUrl' => $block['avatarUrl'],
                'slug' => $block['slug'],
            ];
        }
        return $blockedUsers;
    }
}
