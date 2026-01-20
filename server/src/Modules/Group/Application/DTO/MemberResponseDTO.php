<?php

namespace App\Modules\Group\Application\DTO;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final readonly class MemberResponseDTO
{
    public function __construct(
        public string $id,
        public UserPreviewDTO $user,
        public ?string $role,
        public ?string $status,
    ) {
    }
}
