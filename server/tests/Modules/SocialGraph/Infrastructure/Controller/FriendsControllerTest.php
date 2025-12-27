<?php

namespace Tests\Modules\SocialGraph\Infrastructure\Controller;

use App\Modules\SocialGraph\Domain\Enum\FriendshipStatusEnum;
use App\Modules\SocialGraph\Domain\Entity\Friendship;
use App\Modules\User\Domain\Entity\User;
use App\Tests\Support\ApiWebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Uid\Uuid;


final class FriendsControllerTest extends ApiWebTestCase
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

    public function testFriendsListUnauthorized(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/friends');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function testFriendsListOk(): void
    {
        [$client, $currentUser] = $this->createAuthenticatedClient([
            'email' => 'anton@test.local',
        ]);

        $em = static::getContainer()->get(EntityManagerInterface::class);

        $friend = $this->createUser([
            'email' => 'friend@test.local',
            'username' => 'friend',
        ]);

        // accepted friendship
        $this->createFriendship($em, $currentUser, $friend, FriendshipStatusEnum::ACCEPTED);

        $client->request('GET', '/api/friends');
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

    public function testFriendsDeleteUnauthorized(): void
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
            'email' => 'friend2@test.local',
            'username' => 'friend2',
        ]);

        // accepted friendship
        $this->createFriendship($em, $currentUser, $friend, FriendshipStatusEnum::ACCEPTED);

        $friendId = (string) $friend->getId();

        $client->request('DELETE', '/api/friends/' . $friendId);

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        self::assertJsonStringEqualsJsonString(
            json_encode(['message' => 'Friend removed'], JSON_THROW_ON_ERROR),
            $client->getResponse()->getContent() ?? ''
        );

        // Проверяем, что дружба больше не "ACCEPTED"
        $repo = $em->getRepository(Friendship::class);

        $stillAccepted = $repo->findOneBy([
            'requester' => $currentUser,
            'addressee' => $friend,
            'status' => FriendshipStatusEnum::ACCEPTED,
        ]);

        self::assertNull($stillAccepted);
    }

    public function testFriendsDeleteInvalidUuidReturns500(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('DELETE', '/api/friends/not-a-uuid');

        // Текущее поведение контроллера: try/catch ловит Throwable и отдаёт 500
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_INTERNAL_SERVER_ERROR);

        $json = json_decode($client->getResponse()->getContent() ?? '', true);
        self::assertIsArray($json);
        self::assertArrayHasKey('error', $json);
    }
}
