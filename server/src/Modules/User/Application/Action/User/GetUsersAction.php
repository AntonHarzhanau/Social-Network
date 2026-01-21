<?php

namespace App\Modules\User\Application\Action\User;

use App\Modules\Media\Api\MediaApiInterface;
use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use App\Modules\User\Application\Mapper\UserMapper;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;

final class GetUsersAction
{
    public function __construct(
        private UserRepositoryInterface $users,
         private readonly MediaApiInterface $media,
        private UserMapper $mapper,
        private SocialGraphApiInterface $socialGraphApi,
    ) {
    }

    public function execute(User $currentUser, ?int $page = null, ?int $limit = null, ?string $query = null): array
    {
        $exceptUserIds = array_merge(
            [$currentUser->getId()],
            $this->socialGraphApi->getBlockedUsersIdsForUser($currentUser->getId())
        );
        $userFriendIds = $this->socialGraphApi->getFriendsIdsForUser($currentUser->getId());

        $exceptUserIds = array_merge($exceptUserIds, $userFriendIds);

        $rows = $this->users->findAllExcept($exceptUserIds, $page, $limit, $query);

        $previewIds = array_values(array_unique(array_filter(
            array_map(fn(UserPreviewRowDTO $r) => $r->currentAvatar, $rows)
        )));

        $urlsById = $previewIds
            ? $this->media->getMediasByIds(null, $previewIds)
            : [];

        $urlsById = $previewIds
            ? $this->media->getMediasByIds(null, $previewIds)
            : [];


        $result = [];
        foreach ($rows as $row) {
            $result[] = $this->mapper->toPreview(
                $row,
                $row->currentAvatar ? ($urlsById[$row->currentAvatar]->url ?? null) : null
            );
        }
        return $result;
    }
}
