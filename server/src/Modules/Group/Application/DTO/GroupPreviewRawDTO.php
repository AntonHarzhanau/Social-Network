<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;

final readonly class GroupPreviewRawDTO 
{
    public function __construct(
        public string $id,
        public string $name,
        public string $wallId,
        public bool $isMember,
        public ?GroupMemberRoleEnum $role,
        public int $subscribersCount,
        public ?string $avatarId,
    ) {}
}
