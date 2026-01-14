<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Repository;

use App\Modules\User\Domain\Entity\UserMediaBinding;
use App\Modules\User\Domain\Repository\UserMediaBindingRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<UserMediaBinding>
 */
class UserMediaBindingRepository extends ServiceEntityRepository implements UserMediaBindingRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserMediaBinding::class);
    }

    public function save(UserMediaBinding $entity, bool $flush = true): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UserMediaBinding $entity, bool $flush = true): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Todo: optimize with DQL
    public function findMediasByUserId(Uuid $userId): array
    {
        $bindings = $this->findBy(["owner" => $userId]);
        $medias = [];
        foreach ($bindings as $binding) {
            $medias[] = $binding->getMedia();
        }
        return $medias;
    }
}
