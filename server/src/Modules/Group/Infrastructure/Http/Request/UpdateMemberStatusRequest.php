<?php

namespace App\Modules\Group\Infrastructure\Http\Request;

use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;

final readonly class UpdateMemberStatusRequest
{
    
    public function __construct(
        public readonly GroupMemberStatusEnum $newStatus,
    ) {
    }
}
