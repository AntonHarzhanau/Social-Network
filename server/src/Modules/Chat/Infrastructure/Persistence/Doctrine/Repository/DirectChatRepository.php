<?php

namespace App\Modules\Chat\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Chat\Application\Action\Exception\DirectChatAlreadyExists;
use App\Modules\Chat\Domain\Entity\DirectChat;
use App\Modules\Chat\Domain\Repository\DirectChatRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<DirectChat>
 */
class DirectChatRepository extends ServiceEntityRepository implements DirectChatRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DirectChat::class);
    }

    public function findByUsers(Uuid $userAId, Uuid $userBId): ?DirectChat
    {
        $idA = $userAId;
        $idB = $userBId;

        if (strcmp($idA->toRfc4122(), $idB->toRfc4122()) < 0) {
            $user1 = $userAId;
            $user2 = $userBId;
        } else {
            $user1 = $userBId;
            $user2 = $userAId;
        }

        return $this->createQueryBuilder('dc')
            ->andWhere('IDENTITY(dc.user1) = :user1')
            ->andWhere('IDENTITY(dc.user2) = :user2')
            ->setParameter('user1', $user1)
            ->setParameter('user2', $user2)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(DirectChat $directChat): void
    {
        $em = $this->getEntityManager();
        $em->persist($directChat);

        try {
            $em->flush();
        } catch (UniqueConstraintViolationException $e) {
            $em->clear();
            throw new DirectChatAlreadyExists();
        }
    }
}
