<?php

namespace App\Modules\Chat\Application\ReadModel\Chat;

use App\Modules\Chat\Application\DTO\ChatListItemRowDTO;
use App\Modules\User\Contracts\DTO\UserPreviewDTO;

final class ChatDisplayResolver
{
    public function resolve(ChatListItemRowDTO $row, ?UserPreviewDTO $otherUserPreview): ChatDisplayDTO
    {
        return match ($row->type->value) {
            'direct' => new ChatDisplayDTO(
                title: $otherUserPreview?->name,
                avatarUrl: $otherUserPreview?->avatarUrl,
            ),
            'group' => new ChatDisplayDTO(
                title: $row->title,
                avatarUrl: $row->avatarUrl,
            ),
            default => new ChatDisplayDTO(
                title: 'Personal Chat',
                avatarUrl: null,
            ),
        };
    }
}
