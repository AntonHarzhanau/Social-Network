<?php

namespace App\Modules\Group\Application\DTO;

final readonly class GroupPreviewRawDTO 
{
    public function __construct(
        public string $id,
        public string $name,
        public string $wallId,
        public ?string $avatarId,
    ) {}
}
