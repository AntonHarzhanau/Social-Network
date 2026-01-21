<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface, UserRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $user, bool $flush = true): void
    {
        $this->getEntityManager()->persist($user);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function delete(User $user, bool $flush = true): void
    {
        $this->getEntityManager()->remove($user);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findById(string $id): ?User
    {
        return $this->findOneBy(['id' => $id, 'deletedAt' => null]);
    }

    public function findAllExcept(array $excludedUsers, ?int $page = null, ?int $limit = null, ?string $query = null): array
    {
        $qb = $this->qbUserPreviewRows();

        $this->applyExcludedUsers($qb, $excludedUsers);
        $this->applyUsernameQuery($qb, $query);
        $this->applyPagination($qb, $page, $limit);

        $qb->orderBy('u.createdAt', 'DESC')
            ->addOrderBy('u.id', 'DESC');

        return $qb->getQuery()->getResult();
    }

    public function findByEmail(string $email): ?User
    {
        $qb = $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->setMaxResults(1);

        return $qb->getQuery()->getOneOrNullResult();
    }

    /** @return array<UserPreviewDTO> */
    public function findPreviewsByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $qb = $this->qbUserPreviewRows()
            ->andWhere('u.id IN (:ids)')
            ->setParameter('ids', $ids);

        return $qb->getQuery()->getResult();
    }

    /** @return User|null */
    public function findOneBy(array $criteria, ?array $orderBy = null): ?object
    {
        return parent::findOneBy($criteria, $orderBy);
    }

    /** @return array<string> wallIds */
    public function findWallIdsByUserIds(array $userIds): array
    {
        return $this->createQueryBuilder('u')
            ->select('IDENTITY(u.wall) AS wallId')
            ->andWhere('u.id IN (:ids)')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('ids', $userIds)
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function findPreviewByWallIds(array $wallIds): array
    {
        if ($wallIds === []) {
            return [];
        }

        $qb = $this->qbUserPreviewRows()
            ->andWhere('IDENTITY(u.wall) IN (:wallIds)')
            ->setParameter('wallIds', $wallIds);

        return $qb->getQuery()->getResult();
    }

    private function qbUserPreviewRows(): QueryBuilder
    {
        return $this->createQueryBuilder('u')
            ->select(sprintf(
                'NEW %s(u.id, u.username, p.id, u.slug, IDENTITY(u.wall), u.lastLoginAt)',
                UserPreviewRowDTO::class
            ))
            ->leftJoin('u.currentAvatar', 'ua')
            ->leftJoin('ua.preview', 'p')
            ->andWhere('u.deletedAt IS NULL');
    }

    private function applyUsernameQuery(QueryBuilder $qb, ?string $query): void
    {
        if ($query === null || $query === '') {
            return;
        }

        $escaped = addcslashes($query, '%_\\');

        $qb->andWhere('LOWER(u.username) LIKE :query')
            ->setParameter('query', '%' . mb_strtolower($escaped) . '%');
    }

    private function applyPagination(QueryBuilder $qb, ?int $page, ?int $limit): void
    {
        if ($page === null || $limit === null) {
            return;
        }

        $qb->setMaxResults($limit)
            ->setFirstResult(($page - 1) * $limit);
    }

    private function applyExcludedUsers(QueryBuilder $qb, array $excludedUsers): void
    {
        if ($excludedUsers === []) {
            return;
        }

        $qb->andWhere('u.id NOT IN (:excludedUsers)')
            ->setParameter('excludedUsers', $excludedUsers);
    }
}
