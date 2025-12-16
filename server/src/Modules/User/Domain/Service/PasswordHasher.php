<?php

namespace App\Modules\User\Domain\Service;


interface PasswordHasher
{
    public function hash(string $plainPassword): string;
}
