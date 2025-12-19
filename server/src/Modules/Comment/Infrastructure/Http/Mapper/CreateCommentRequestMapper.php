<?php

namespace App\Modules\Comment\Infrastructure\Http\Mapper;

use App\Modules\Comment\Application\Command\AddComment;
use App\Modules\Comment\Infrastructure\Http\Request\CreateCommentRequest;

class CreateCommentRequestMapper
{
    public static function map(CreateCommentRequest $request): AddComment
    {
        return new AddComment(
            content: $request->content,
        );
    }
}
