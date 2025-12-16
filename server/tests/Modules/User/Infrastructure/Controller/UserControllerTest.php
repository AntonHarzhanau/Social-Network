<?php

declare(strict_types=1);

namespace Tests\Modules\User\Infrastructure\Controller;

use App\Modules\User\Infrastructure\Persistence\Doctrine\Entity\DoctrineUser;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;


final class UserControllerTest extends WebTestCase
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

    public function testListRequiresAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/users');

        self::assertTrue(in_array($client->getResponse()->getStatusCode(), [401], true));
    }

    public function testListOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');

        $client = $this->authClient($client, $user);

        $client->request('GET', '/api/users');

        self::assertResponseIsSuccessful();
        self::assertJson($client->getResponse()->getContent() ?? '');
    }

    public function testUpdateProfileOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');

        $client = $this->authClient($client, $user);

        $client->request('PUT', '/api/users/profile', content: json_encode([
            'username' => 'New Name',
            'location' => 'Strasbourg',
            'bio' => 'New bio',
            'coverUrl' => null,
            'maritalStatus' => null,
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testUpdateAvatarOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $user = $this->createUser($em, 'anton@test.local');
        $client = $this->authClient($client, $user);

        $client->request('PUT', '/api/users/avatar', content: json_encode([
            'avatarUrl' => 'https://cdn.test/a.png',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testDeleteAccountOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');
        $client = $this->authClient($client, $user);

        $client->request('DELETE', '/api/users');

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testGetProfileOk(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');

        $client = $this->authClient($client, $user);

        $client->request('GET', '/api/users/' . $user->getId() . '/profile');

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
        self::assertJsonStringEqualsJsonString(json_encode($expectedResponse, JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testGetProfileError(): void
    {
        $client = static::createClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $user = $this->createUser($em, 'anton@test.local');
        $fakeUser = $this->createUser($em, 'test@mail.com');
        $fakeUserId = $fakeUser->getId();
        $em->remove($fakeUser);
        $em->flush();

        $client = $this->authClient($client, $user);

        $client->request('GET', '/api/users/' . $fakeUserId . '/profile');

        
        self::assertResponseStatusCodeSame(404);
        self::assertJsonStringEqualsJsonString(json_encode([
            'error' => 'User not found.',
        ], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }
}
