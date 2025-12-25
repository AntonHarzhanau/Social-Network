<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Contracts\DTO\UserPreviewDTO;
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
    public function findAllExcept(User $excludedUser): array
    {
        $queryBuilder = $this->createQueryBuilder('u')
            ->where('u != :excludedUser')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('excludedUser', $excludedUser);

        return $queryBuilder->getQuery()->getResult();
    }

    public function findByEmail(string $email): ?User
    {
        $queryBuilder = $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->setMaxResults(1);

        return $queryBuilder->getQuery()->getOneOrNullResult();
    }

    public function findByUsername(string $username): ?User
    {
        $queryBuilder = $this->createQueryBuilder('u')
            ->andWhere('u.username = :username')
            ->setParameter('username', $username)
            ->setMaxResults(1);
        return $queryBuilder->getQuery()->getOneOrNullResult();
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
        $queryBuilder = $this->createQueryBuilder('u')
            ->select(sprintf('NEW %s(u.id, u.username, u.avatarUrl, u.slug)', UserPreviewDTO::class))
            ->andWhere('u.id IN (:ids)')
            ->andWhere('u.deletedAt IS NULL')
            ->setParameter('ids', $ids);

        return $queryBuilder->getQuery()->getResult();
    }

    /** @return User|null */
    public function findOneBy(array $criteria, ?array $orderBy = null): ?object
    {
        return parent::findOneBy($criteria, $orderBy);
    }
}
