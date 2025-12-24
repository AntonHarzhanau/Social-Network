<?php

namespace App\Modules\Chat\Infrastructure\Http\Mapper;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Infrastructure\Http\Request\NewMessageRequest;

final class NewMessageRequestMapper
{
    public static function map(NewMessageRequest $request): NewMessage
    {
        if ($request->content === null) {
            throw new \InvalidArgumentException('Content is required.');
        }
        return new NewMessage(
            content: $request->content,
        );
    }
}
