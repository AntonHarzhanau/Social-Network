<?php

namespace Tests\Modules\SocialGraph\Infrastructure\Controller;

use App\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\User\Domain\Entity\User;
use App\Tests\Support\ApiWebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Uid\Uuid;


final class FriendsRequestsControllerTest extends ApiWebTestCase
{
    private function createFriendship(
        EntityManagerInterface $em,
        User $requester,
        User $addressee,
        FriendshipStatusEnum $status
    ): Friendship {
        $friendship = new Friendship();
        $friendship->setRequester($requester);
        $friendship->setAddressee($addressee);
        $friendship->setStatus($status);

        $em->persist($friendship);
        $em->flush();

        return $friendship;
    }

    public function testFriendsRequestsListUnauthorized(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/friends-requests');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testFriendsRequestsSentListOk(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient([
            'email' => 'anton@test.local',
        ]);

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $this->createFriendship($em, $currentUser, $friend, FriendshipStatusEnum::PENDING);

        $client->request('GET', '/api/friends-requests?type=sent');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        self::assertJsonStringEqualsJsonString(
            json_encode([
                [
                    'id' => (string) $friend->getId(),
                    'username' => $friend->getUsername(),
                    'slug' => $friend->getSlug(),
                    'avatarUrl' => $friend->getAvatarUrl(),
                ],
            ], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }

    public function testFriendsRequestsReceivedListOk(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient([
            'email' => 'anton@test.local',
        ]);

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $this->createFriendship($em, $friend, $currentUser,  FriendshipStatusEnum::PENDING);

        $client->request('GET', '/api/friends-requests?type=received');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        self::assertJsonStringEqualsJsonString(
            json_encode([
                [
                    'id' => (string) $friend->getId(),
                    'username' => $friend->getUsername(),
                    'slug' => $friend->getSlug(),
                    'avatarUrl' => $friend->getAvatarUrl(),
                ],
            ], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }

    public function testFriendsRequestsListFailure(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient([
            'email' => 'anton@test.local',
        ]);

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $this->createFriendship($em, $friend, $currentUser,  FriendshipStatusEnum::PENDING);

        $client->request('GET', '/api/friends-requests?type=');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_BAD_REQUEST);
        self::assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Type query parameter is required'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );

        $client->request('GET', '/api/friends-requests?type=invalid_type');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_BAD_REQUEST);
        self::assertJsonStringEqualsJsonString(
            json_encode(['error' => 'Invalid type parameter'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }

    public function testFriendsRequestsDeleteUnauthorized(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/friends/' . (string) Uuid::v4());

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testFriendsDeleteOk(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient();

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $friend = $this->createUser([
            'email' => 'friend@test.com',
            'username' => 'friend',
        ]);
        $this->createFriendship($em, $currentUser, $friend, FriendshipStatusEnum::PENDING);

        $client->request('DELETE', '/api/friends-requests/' . $friend->getId()->toRfc4122());
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        self::assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Friend request canceled'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );

    }

    // public function testFriendsDeleteInvalidUuidReturns500(): void
    // {
    //     [$client] = $this->createAuthenticatedClient();

    //     $client->request('DELETE', '/api/friends/not-a-uuid');

    //     // Текущее поведение контроллера: try/catch ловит Throwable и отдаёт 500
    //     self::assertResponseStatusCodeSame(JsonResponse::HTTP_INTERNAL_SERVER_ERROR);

    //     $json = json_decode($client->getResponse()->getContent() ?? '', true);
    //     self::assertIsArray($json);
    //     self::assertArrayHasKey('error', $json);
    // }
}
