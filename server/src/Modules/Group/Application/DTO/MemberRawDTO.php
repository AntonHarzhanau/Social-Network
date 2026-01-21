<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;

final readonly class MemberRawDTO
{
    public function __construct(
        public string $id,
        public string $userId,
        public GroupMemberRoleEnum $role,
        public GroupMemberStatusEnum $status,
    ) {
    }
}
