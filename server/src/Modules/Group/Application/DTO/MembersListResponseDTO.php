<?php

namespace App\Modules\Group\Application\DTO;

final readonly class MembersListResponseDTO
{
    public function __construct(
        public int $totalCount,
  
        public array $members,
    ) {
    }
}
