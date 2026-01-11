<?php

namespace App\Modules\Comment\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Comment\Domain\Entity\CommentThread;
use App\Modules\Comment\Domain\Repository\CommentThreadRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<CommentThread>
 */
class CommentThreadRepository extends ServiceEntityRepository implements CommentThreadRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CommentThread::class);
    }

    public function findThreadById(Uuid $threadId): ?CommentThread
    {
        return $this->find($threadId);
    }

}
