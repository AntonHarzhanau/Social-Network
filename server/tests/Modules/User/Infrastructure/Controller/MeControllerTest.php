<?php

namespace App\Tests\Modules\User\Infrastructure\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use App\Tests\Support\ApiWebTestCase;

final class MeControllerTest extends ApiWebTestCase
{

    public function testMeUnauthorized(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/me');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testMeRejectsInvalidJwt(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/me', server: [
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer invalid.token.value',
        ]);

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
        self::assertResponseHeaderSame('content-type', 'application/json');
    }

    public function testMeOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $client->request('GET', '/api/me');

        $expectedResponse = [
            'avatarUrl' => $user->getAvatarUrl(),
            'bio' => $user->getBio(),
            'coverUrl' => $user->getCoverUrl(),
            'createdAt' => $user->getCreatedAt()->format(\DateTimeInterface::ATOM),
            'dateOfBirth' => $user->getDateOfBirth()->format('Y-m-d'),
            'email' => $user->getEmail(),
            'emailVerifiedAt' => $user->getEmailVerifiedAt()->format(\DateTimeInterface::ATOM),
            'id' => (string) $user->getId(),
            'lastLoginAt' => $user->getLastLoginAt()?->format(\DateTimeInterface::ATOM),
            'location' => $user->getLocation(),
            'maritalStatus' => $user->getMaritalStatus(),
            'slug' => $user->getSlug(),
            'name' => $user->getUsername(),
            'wallId' => (string) $user->getWall()->getId(),
            'isOnline' => true,
            'privacySettings' => [
                'postsVisibility' => 'public',
                'mediaVisibility' => 'public',
                'friendsVisibility' => 'public',
                'profileVisibility' => 'public',
                'groupsVisibility' => 'public',
            ],
        ];

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode($expectedResponse, JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }
}
