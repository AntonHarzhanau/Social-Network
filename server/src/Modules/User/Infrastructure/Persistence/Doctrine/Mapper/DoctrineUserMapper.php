<?php

namespace App\Modules\User\Infrastructure\Persistence\Doctrine\Mapper;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use App\Modules\Shared\Infrastructure\Persistence\Doctrine\Mapper\AbstractDoctrineMapper;

final readonly class DoctrineUserMapper extends AbstractDoctrineMapper
{
    const DOMAIN_CLASS_NAME = User::class;
    const DOCTRINE_CLASS_NAME = DoctrineUser::class;
}
