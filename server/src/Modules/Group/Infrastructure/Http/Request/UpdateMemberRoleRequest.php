<?php

namespace App\Modules\Group\Infrastructure\Http\Request;

use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;

final readonly class UpdateMemberRoleRequest
{
    public function __construct(
        public readonly GroupMemberRoleEnum $newRole,
    ) {
    }
}
