<?php

namespace App\Modules\Shared\Infrastructure\Persistence\Doctrine\Repository;

trait DoctrineRepositoryTrait
{
    abstract protected function doctrineClassName(): string;

    private function _findOneById(string $id): ?object
    {
        $doctrineObject = $this->find($id);
        return $this->getOneOrNothing($doctrineObject);
    }

    private function getOneOrNothing(?object $doctrineObject): ?object
    {
        return $doctrineObject ? $this->mapper->fromDoctrine($doctrineObject) : null;
    }

    private function _delete(object $domainObject, bool $flush = true): void
    {
        $id = $domainObject->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('Cannot delete entity without id.');
        }

        $managed = $this->entityManager->find($this->doctrineClassName(), $id);
        if (!$managed) {
            return; 
        }

        $this->entityManager->remove($managed);

        if ($flush) {
            $this->entityManager->flush();
        }
    }

    public function _save(object $domainObject, bool $flush = true): void
    {
        $id = $domainObject->getId();

        if ($id !== null) {
            $doctrineObject = $this->entityManager->find($this->doctrineClassName(), $id);

            if (!$doctrineObject) {
                throw new \RuntimeException('Entity not found for update.');
            }

            $this->mapper->toDoctrine($domainObject, $doctrineObject);
        } else {
            $doctrineObject = $this->mapper->toDoctrine($domainObject);
            $this->entityManager->persist($doctrineObject);
        }

        if ($flush) {
            $this->entityManager->flush();
        }
    }
}
