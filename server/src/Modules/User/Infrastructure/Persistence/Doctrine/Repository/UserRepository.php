<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use App\Modules\User\Infrastructure\Persistence\Doctrine\Mapper\DoctrineUserMapper;
use App\Modules\Shared\Infrastructure\Persistence\Doctrine\Repository\DoctrineRepositoryTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<DoctrineUser>
 */
class UserRepository extends ServiceEntityRepository implements UserRepositoryInterface
{
    use DoctrineRepositoryTrait;

    const DOCTRINE_CLASS_NAME = DoctrineUser::class;

    public function __construct(
        protected DoctrineUserMapper $mapper,
        protected EntityManagerInterface $entityManager,
        ManagerRegistry $registry
    ) {
        parent::__construct($registry, DoctrineUser::class);
    }

    protected function doctrineClassName(): string
    {
        return DoctrineUser::class;
    }

    public function save(User $user, bool $flush = true): void
    {
        $this->_save($user, $flush);
    }

    public function delete(User $user, bool $flush = true): void
    {
       $this->_delete($user);
    }

    public function findOneById(string $id): ?User
    {
        return $this->_findOneById($id);
    }

    public function findByEmail(string $email): ?User
    {
        $user = $this->findOneBy(['email' => $email]);
        return $this->getOneOrNothing($user); 
    }

    public function findAllExcept(Uuid $excludedUserId): array
    {
        $qb = $this->createQueryBuilder('u')
            ->where('u.id != :excludedId')
            ->setParameter('excludedId', $excludedUserId);
        $doctrineUsers = $qb->getQuery()->getResult();

        return array_map(fn(DoctrineUser $doctrineUser) => $this->mapper->fromDoctrine($doctrineUser), $doctrineUsers);
    }

    public function updateUser(User $user): void
    { 
        $this->_save($user, true);
    }
}
