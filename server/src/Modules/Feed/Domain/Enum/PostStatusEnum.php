<?php
namespace App\Modules\Feed\Domain\Enum;

enum PostStatusEnum: string
{
    case PUBLISHED = 'published';
    case PENDING = 'pending';
    case REJECTED = 'rejected';
    case DELETED = 'deleted';
}
