<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;
use App\Modules\User\Contracts\DTO\UserPreviewRowDTO;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
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
        return $this->findBy(['id' => $id, 'deletedAt' => null])[0] ?? null;
    }

    /** @return array<User> */
    public function findAllExcept(array $excludedUsers, ?int $page = null, ?int $limit = null, ?string $query = null): array
    {
        $qb = $this->createQueryBuilder('u')
            ->where('u.id NOT IN (:excludedUsers)')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('excludedUsers', $excludedUsers)
            ->orderBy('u.createdAt', 'DESC')
            ->addOrderBy('u.id', 'DESC');

        if ($query !== null && $query !== '') {
            $escaped = addcslashes($query, '%_\\');
            $qb->andWhere('LOWER(u.username) LIKE :query')
                ->setParameter('query', '%' . mb_strtolower($escaped) . '%');
        }

        if ($limit !== null && $page !== null) {
            $qb->setMaxResults($limit)
                ->setFirstResult(($page - 1) * $limit);
        }



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

    public function findByUsername(string $username): ?User
    {
        $qb = $this->createQueryBuilder('u')
            ->andWhere('u.username = :username')
            ->setParameter('username', $username)
            ->setMaxResults(1);
        return $qb->getQuery()->getOneOrNullResult();
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

    /** @return array<UserPreviewDTO> */
    public function findPreviewsByIds(array $ids): array
    {
        $qb = $this->createQueryBuilder('u')
            ->select(
                sprintf(
                    'NEW %s(u.id, u.username, p.id, u.slug, IDENTITY(u.wall))',
                    UserPreviewRowDTO::class
                )
            )
            ->leftJoin('u.currentAvatar', 'ua')
            ->leftJoin('ua.preview', 'p')
            ->andWhere('u.id IN (:ids)')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('ids', $ids);
        $result = $qb->getQuery()->getResult();
        return $result;
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

    public function findPreviewRowsByWallIds(array $wallIds): array
    {
        return $this->createQueryBuilder('u')
            ->select(
                sprintf(
                    'NEW %s(u.id, u.username, p.id, u.slug, IDENTITY(u.wall))',
                    UserPreviewRowDTO::class
                )
            )
            ->leftJoin('u.currentAvatar', 'ua')
            ->leftJoin('ua.preview', 'p')
            ->andWhere('IDENTITY(u.wall) IN (:wallIds)')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('wallIds', $wallIds)
            ->getQuery()
            ->getResult();
    }
}
