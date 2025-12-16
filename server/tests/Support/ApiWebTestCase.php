<?php

namespace Test\Support;

use App\Modules\Identity\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class ApiWebTestCase extends WebTestCase
{
    protected function em(): EntityManagerInterface
    {
        return static::getContainer()->get(EntityManagerInterface::class);
    }

    protected function createUser(string $email = 'user@mail.com'): DoctrineUser
    {
        $em = $this->em();
        $user = new DoctrineUser();
        $user->setEmail($email);
        $user->setPassword('password');
        $user->setUsername('username');
        $user->setDateOfBirth(new \DateTimeImmutable('1990-01-01'));

        $em->persist($user);
        $em->flush();
        return $user;
    }

    protected function authClient(DoctrineUser $user): KernelBrowser
    {
        $jwt = static::getContainer()
        ->get(JWTTokenManagerInterface::class)
        ->create($user);

        $client = static::createClient();
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer %s' . $jwt);
        $client->setServerParameter('CONTENT_TYPE', 'application/json');
        return $client;
    }
}
