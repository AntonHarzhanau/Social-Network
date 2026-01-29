<?php

namespace App\Modules\Group\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\Group\Application\DTO\MemberRawDTO;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<GroupMember>
 */
class GroupMemberRepository extends ServiceEntityRepository implements GroupMemberRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GroupMember::class);
    }

    public function save(GroupMember $entity, bool $flush = true): void
    {
        try {
            $this->getEntityManager()->persist($entity);
            if ($flush) {
                $this->getEntityManager()->flush();
            }
        } catch (UniqueConstraintViolationException $e) {
            throw new \DomainException('User is already a member of this group.');
        }

    }

    public function delete(GroupMember $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findGroupMembers(
        Uuid $groupId,
        ?GroupMemberStatusEnum $status = null,
        ?GroupMemberRoleEnum $role = null,
        int $page = 1,
        int $limit = 10,
        string $query = '',
    ): array {
        $qb = $this->createQueryBuilder('gm')
            ->innerJoin('gm.user', 'u') // ✅ для поиска
            ->select(sprintf(
                'NEW %s (gm.id, IDENTITY(gm.user), gm.role, gm.status)',
                MemberRawDTO::class
            ))
            ->andWhere('gm.group = :groupId')
            ->setParameter('groupId', $groupId)
            ->orderBy('gm.joinedAt', 'ASC')
            ->addOrderBy('gm.id', 'ASC');

        if ($status !== null) {
            $qb->andWhere('gm.status = :status')
                ->setParameter('status', $status);
        }

        if ($role !== null) {
            $qb->andWhere('gm.role = :role')
                ->setParameter('role', $role);
        }

        $query = trim($query);
        if ($query !== '') {
            $qb->andWhere('LOWER(u.username) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($query) . '%');
        }

        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }
    public function findOneByCriteria(array $criteria): ?GroupMember
    {
        return $this->findOneBy($criteria);
    }

    public function countGroupMembers(Uuid $groupId, ?GroupMemberStatusEnum $status = null): int
    {
        $qb = $this->createQueryBuilder('gm')
            ->select('COUNT(gm.id)')
            ->where('gm.group = :groupId')
            ->setParameter('groupId', $groupId);

        if ($status !== null) {
            $qb->andWhere('gm.status = :status')
                ->setParameter('status', $status);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

}
