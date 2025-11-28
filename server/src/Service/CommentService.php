<?php

namespace App\Service;

use App\DTO\Comment\CommentViewDTO;
use App\DTO\Comment\CreateCommentDTO;
use App\DTO\Common\AuthorSummaryDTO;
use App\Entity\Comment;
use App\Entity\Post;
use App\Entity\User;
use App\Factory\Comment\CommentFactory;
use App\Repository\CommentRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class CommentService
{
    public function __construct(
        private readonly CommentRepository $commentRepository,
        private readonly CommentFactory $commentFactory
    ) {}

    public function create(CreateCommentDTO $dto, User $author, Post $post): void
    {
        $comment = new Comment();
        $comment->setContent($dto->content);
        $comment->setAuthor($author);
        $comment->setPost($post);
        $this->commentRepository->save($comment);
    }

    public function toggleLike(Comment $comment, User $user): int
    {
        if ($comment->getLikeBy()->contains($user)) {
            $comment->getLikeBy()->removeElement($user);
            $comment->setLikeCount($comment->getLikeCount() - 1);
        } else {
            $comment->getLikeBy()->add($user);
            $comment->setLikeCount($comment->getLikeCount() + 1);
        }

        $this->commentRepository->save($comment);

        return $comment->getLikeCount();
    }

    public function replyToComment(Comment $parentComment, CreateCommentDTO $dto, User $author): void
    {
        $comment = new Comment();
        $comment->setContent($dto->content);
        $comment->setAuthor($author);
        $comment->setParent($parentComment);
        $comment->setPost($parentComment->getPost());
        $this->commentRepository->save($comment);
    }

    public function delete(Comment $comment, User $user): void
    {
        if ($comment->getAuthor() !== $user && $comment->getPost()->getAuthor() !== $user) {
            throw new AccessDeniedHttpException('You do not have permission to delete this comment.');
        }

        $this->commentRepository->remove($comment);
    }

    public function update(Comment $comment, CreateCommentDTO $dto, User $user): void
    {
        if ($comment->getAuthor() !== $user) {
            throw new AccessDeniedHttpException('You do not have permission to update this comment.');
        }

        if ($dto->content !== null) {
            $comment->setContent($dto->content);
        }
        $this->commentRepository->save($comment);
    }

    public function getRootCommentsByPost(Post $post, int $page = 1, int $limit = 2): array
    {
        return $this->commentRepository->findRootByPost($post, $page, $limit);
    }

    public function getCommentsForPost(Post $post, User $currentUser, int $page = 1, int $limit = 10) : array
    {
        $rows = $this->commentRepository->findRootForPost($post, $currentUser, $page, $limit);
        $result = [];
        foreach ($rows as $row) {
            $comment = $row[0];
            $replyCount = $row['replyCount'];
            $likedByCurrentUser = $row['likedByCurrentUser'];
            
            $result[] = $this->commentFactory->toCommentViewDTO($comment, $replyCount, $likedByCurrentUser);
        }
        return $result;
    }
}
