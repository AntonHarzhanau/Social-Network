<?php

namespace App\Modules\SocialGraph\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;

final class FriendIdRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Friend ID is required')]
        #[Assert\Uuid(message: 'Friend ID must be a valid UUID')]
        public readonly string $friendId,
    ) {}
}
