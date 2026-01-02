<?php

namespace App\Modules\SocialGraph\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\SocialGraph\Domain\Entity\UserBlock;
use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<UserBlock>
 */
class UserBlockRepository extends ServiceEntityRepository implements UserBlockRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserBlock::class);
    }

    public function save(UserBlock $userBlock, bool $flush = true): Uuid
    {
        $this->getEntityManager()->persist($userBlock);

        if ($flush) {
            $this->getEntityManager()->flush();
        }

        return $userBlock->getId();
    }

    public function remove(UserBlock $userBlock, bool $flush = true): void
    {
        $this->getEntityManager()->remove($userBlock);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findAllBlocksByBlockerId(Uuid $blockerId, int $page, int $limit): array
    {
        return $this->createQueryBuilder('ub')
            ->select([
                'blocked.id AS id',
                'blocked.username AS username',
                'blocked.avatarUrl AS avatarUrl',
                'blocked.slug AS slug', 
            ])
            ->innerJoin('ub.blocked', 'blocked')
            ->where('ub.blocker = :blockerId')
            ->setParameter('blockerId', $blockerId)
            ->orderBy('ub.createdAt', 'DESC')
            ->addOrderBy('ub.id', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function getBlockedUserIdsForUser(Uuid $blockerId): array
    {

        $results = $this->createQueryBuilder('ub')
            ->select('blocked.id')
            ->innerJoin('ub.blocked', 'blocked')
            ->where('ub.blocker = :blockerId')
            ->setParameter('blockerId', $blockerId)
            ->getQuery()
            ->getResult();
        return $results;
    }

    public function findOneByBlockerAndBlocked(Uuid $blockerId, Uuid $blockedId): ?UserBlock
    {
        $block = $this->findOneBy([
            'blocker' => $blockerId,
            'blocked' => $blockedId,
        ]);
        return $block;
    }
}
