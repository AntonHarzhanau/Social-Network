<?php

declare(strict_types=1);

namespace Tests\Modules\User\Infrastructure\Controller;

use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


final class AuthControllerTest extends WebTestCase
{
    protected function createUser(EntityManagerInterface $em, string $email = 'user@mail.com'): DoctrineUser
    {
        $user = new DoctrineUser();
        $user->setEmail($email);
        $user->setPassword('password');
        $user->setUsername('username');
        $user->setDateOfBirth(new \DateTimeImmutable('1990-01-01'));

        $em->persist($user);
        $em->flush();

        return $user;
    }

    protected function authClient(KernelBrowser $client, DoctrineUser $user): KernelBrowser
    {
        $jwt = static::getContainer()
            ->get(JWTTokenManagerInterface::class)
            ->create($user);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . $jwt);
        $client->setServerParameter('CONTENT_TYPE', 'application/json');

        return $client;
    }

    public function testAuthMeUnathorized(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/auth/me');

        self::assertResponseStatusCodeSame(401);
    }

    public function testAuthMeOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');

        $client = $this->authClient($client, $user);

        $client->request('GET', '/api/auth/me');

        $expectedResponse = [
            'avatarUrl' => $user->getAvatarUrl(),
            'bio' => $user->getBio(),
            'coverUrl' => $user->getCoverUrl(),
            'createdAt' => $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
            'dateOfBirth' => $user->getDateOfBirth()->format('Y-m-d'),
            'email' => $user->getEmail(),
            'emailVerifiedAt' => $user->getEmailVerifiedAt(),
            'id' => (string) $user->getId(),
            'lastLoginAt' => $user->getLastLoginAt(),
            'location' => $user->getLocation(),
            'maritalStatus' => $user->getMaritalStatus(),
            'slug' => $user->getSlug(),
            'username' => $user->getUsername(),
        ];

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode($expectedResponse), $client->getResponse()->getContent() ?? '');
    }

}
