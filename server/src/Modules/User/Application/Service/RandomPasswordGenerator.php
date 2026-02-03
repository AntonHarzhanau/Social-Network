<?php

namespace App\Modules\User\Application\Service;

final class RandomPasswordGenerator
{
    public function generate(int $length = 16): string
    {
        $raw = rtrim(strtr(base64_encode(random_bytes((int) ceil($length * 0.75 + 2))), '+/', '-_'), '=');
        return substr($raw, 0, $length);
    }
}
