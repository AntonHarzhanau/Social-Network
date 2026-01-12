<?php

namespace App\Modules\Feed\Application\DTO;

use App\Modules\Group\Api\DTO\GroupPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;

enum PostContextType: string
{
    case USER = 'user';
    case GROUP = 'group';
}

final readonly class PostContextDTO
{
    public function __construct(
        public PostContextType $type,
        public ?UserPreviewDTO $user = null,
        public ?GroupPreviewDTO $group = null,
    ) {}
}
