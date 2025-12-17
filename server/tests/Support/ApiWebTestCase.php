<?php

namespace App\Tests\Support;

use App\Modules\User\Domain\Entity\User;
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

    protected function createUser(array $overrides = []): User
    {
        $defaults = [
            'email' => 'user@mail.com',
            'password' => 'password',
            'username' => 'username',
            'dateOfBirth' => new \DateTimeImmutable('1996-08-16'),
        ];

        $data = array_merge($defaults, $overrides);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setUsername($data['username']);
        $user->setDateOfBirth($data['dateOfBirth']);

        $em = $this->em();
        $em->persist($user);
        $em->flush();

        return $user;
    }

    protected function authClient(KernelBrowser $client, User $user): KernelBrowser
    {
        $jwt = static::getContainer()
            ->get(JWTTokenManagerInterface::class)
            ->create($user);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . $jwt);
        $client->setServerParameter('HTTP_ACCEPT', 'application/json');
        $client->setServerParameter('CONTENT_TYPE', 'application/json');

        return $client;
    }

    /**
     * @return array{0: KernelBrowser, 1: User}
     */
    protected function createAuthenticatedClient(array $userOverrides = []): array
    {
        $client = static::createClient();
        $user = $this->createUser($userOverrides);

        $client = $this->authClient($client, $user);

        return [$client, $user];
    }

    protected function tearDown(): void
    {
        if (static::getContainer(false) !== null) {
            $em = $this->em();
            $em->clear();
        }

        parent::tearDown();
    }
}

