<?php

namespace App\Factory\Comment;

use App\DTO\Comment\CommentViewDTO;
use App\Entity\Comment;
use App\Factory\User\UserFactory;

class CommentFactory
{
    public function __construct(
        private readonly UserFactory $userFactory
    ) {}

    public function toCommentViewDTO(Comment $comment, int $replyCount, bool $likedByCurrentUser): CommentViewDTO
    {
        $user = $comment->getAuthor();
        return new CommentViewDTO(
            id: $comment->getId(),
            author: $this->userFactory->toUserResponseDTO($user),
            content: $comment->getContent(),
            likeCount: $comment->getLikeCount(),
            createdAt: $comment->getCreatedAt(),
            likedByCurrentUser: $likedByCurrentUser,
            replyCount: $replyCount
        );
    }
}
