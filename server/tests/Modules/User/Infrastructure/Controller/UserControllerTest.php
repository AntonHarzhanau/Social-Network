<?php

declare(strict_types=1);

namespace Tests\Modules\User\Infrastructure\Controller;

use App\Tests\Support\ApiWebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

final class UserControllerTest extends ApiWebTestCase
{

    public function testListRequiresAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/users');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testListOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $client = $this->authClient($client, $user);

        $client->request('GET', '/api/users');

        self::assertResponseIsSuccessful();
        self::assertJson($client->getResponse()->getContent() ?? '');
    }

    public function testUpdateProfileOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

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
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $client = $this->authClient($client, $user);

        $client->request('PUT', '/api/users/avatar', content: json_encode([
            'avatarUrl' => 'https://cdn.test/a.png',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testDeleteAccountOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);
        $client = $this->authClient($client, $user);
        $client->request('DELETE', '/api/users');

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testGetProfileOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

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
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $fakeUser = $this->createUser( [
            'email' => 'fake@test.com',
        ]);
        
        $em = static::getContainer()->get(EntityManagerInterface::class);
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
