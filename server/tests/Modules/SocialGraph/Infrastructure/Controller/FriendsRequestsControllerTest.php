<?php

namespace Tests\Modules\SocialGraph\Infrastructure\Controller;

use App\Modules\Shared\Domain\Enum\FriendshipStatusEnum;
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
        [$client, $currentUser] = $this->createAuthenticatedClient(
            ['email' => 'anton@test.local']
        );

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

    public function testFriendsDeleteInvalidUuidReturns500(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('DELETE', '/api/friends-requests/not-a-uuid');

        //Currently, invalid UUIDs lead to a 500 error due to exception in controller.
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_INTERNAL_SERVER_ERROR);

        $json = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('error', $json);
        // self::assertStringContainsString('Invalid UUID string', $json['error']);
    }

    public function testFriendsSendRequest(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient(
            ['email' => 'anton@test.local']
        );

        $fakeFriendId = Uuid::v4();
        $client->request('POST', '/api/friends-requests', [
            'friendId' => (string) $fakeFriendId,
        ]);

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NOT_FOUND);


        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $client->request('POST', '/api/friends-requests', [
            'friendId' => (string) $friend->getId(),
        ]);

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);

        self::assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Friend request sent'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }

    public function testFriendsAcceptRequest(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient(
            ['email' => 'anton@test.local']
        );

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $this->createFriendship(
            static::getContainer()->get(EntityManagerInterface::class),
            $friend,
            $currentUser,
            FriendshipStatusEnum::PENDING
        );

        $client->request('POST', '/api/friends-requests/' . (string) $friend->getId() . '/accept');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);

        self::assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Friend request accepted'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }

    public function testFriendsDeclineRequest(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient(
            ['email' => 'anton@test.local']
        );

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        $this->createFriendship(
            static::getContainer()->get(EntityManagerInterface::class),
            $friend,
            $currentUser,
            FriendshipStatusEnum::PENDING
        );

        $client->request('POST', '/api/friends-requests/' . (string) $friend->getId() . '/decline');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);

        self::assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Friend request declined'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );
    }
}
