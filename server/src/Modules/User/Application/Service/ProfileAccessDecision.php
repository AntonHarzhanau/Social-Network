<?php

namespace App\Modules\User\Application\Service;

final class ProfileAccessDecision
{
    public function __construct(
        public bool $canViewPrivateSummary,
        public bool $canViewMore,
    ) {}
}

