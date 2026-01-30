<?php

namespace App\Modules\User\Application\Service;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Enum\ProfileVisibilityEnum;

final class ProfileAccessPolicy
{
    public function decide(User $viewer, User $owner, bool $isBlocked, bool $isFriend): ProfileAccessDecision
    {
        if ($viewer->getId()->equals($owner->getId())) {
            return new ProfileAccessDecision(true, true);
        }

        if ($isBlocked) {
            return new ProfileAccessDecision(false, false);
        }

        $visibility = $owner->getPrivacySettings()->getProfileVisibility();

        return match ($visibility) {
            ProfileVisibilityEnum::PUBLIC  => new ProfileAccessDecision(true, true),
            ProfileVisibilityEnum::FRIENDS => new ProfileAccessDecision($isFriend, $isFriend),
            ProfileVisibilityEnum::PRIVATE => new ProfileAccessDecision(false, false),
        };
    }
}
