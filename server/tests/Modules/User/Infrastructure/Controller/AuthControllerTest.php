<?php


namespace Tests\Modules\User\Infrastructure\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use App\Tests\Support\ApiWebTestCase;

final class AuthControllerTest extends ApiWebTestCase
{

    public function testAuthMeUnathorized(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/auth/me');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testAuthMeOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);
        

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
        self::assertJsonStringEqualsJsonString(json_encode($expectedResponse, JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }
}
