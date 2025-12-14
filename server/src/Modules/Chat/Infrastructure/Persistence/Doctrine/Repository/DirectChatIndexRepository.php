<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Domain\Entity\DirectChatIndex;
use App\Modules\Chat\Domain\Repository\DirectChatIndexRepositoryInterface;
use App\Modules\Identity\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DirectChatIndex>
 */
class DirectChatIndexRepository extends ServiceEntityRepository implements DirectChatIndexRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DirectChatIndex::class);
    }

    public function findByUsers(User $userA, User $userB): ?DirectChatIndex
    {
        $idA = $userA->getId();
        $idB = $userB->getId();

        if ($idA < $idB) {
            $user1 = $userA;
            $user2 = $userB;
        } else {
            $user1 = $userB;
            $user2 = $userA;
        }

        return $this->createQueryBuilder('dci')
            ->andWhere('dci.user1 = :user1')
            ->andWhere('dci.user2 = :user2')
            ->setParameter('user1', $user1)
            ->setParameter('user2', $user2)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
