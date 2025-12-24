<?php

namespace App\Modules\User\Api;

use App\Modules\User\Domain\Entity\User;

interface UserApiInterface
{
    public function findById(string $id): ?User;

    /** @return list<User> */
    public function findManyByIds(array $ids): array; 

    /** @return list<UserPreview> */
    public function findPreviewsByIds(array $ids): array;
}
