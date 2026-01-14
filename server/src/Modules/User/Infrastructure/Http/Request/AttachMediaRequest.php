<?php

namespace App\Modules\User\Infrastructure\Http\Request;

final readonly class AttachMediaRequest
{
    public function __construct(
        public array $mediaIds = [],
    ) {}
}
