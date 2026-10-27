<?php

declare(strict_types=1);

namespace App\Tests\Modules\User\Infrastructure\Controller;

use App\Modules\Media\Application\Action\UploadMediaAction;
use App\Modules\User\Domain\Entity\User;
use App\Tests\Support\ApiWebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;

final class UserControllerTest extends ApiWebTestCase
{

    private function makeTestJpegUpload(): UploadedFile
    {
        $tmp = tempnam(sys_get_temp_dir(), 'upl_');
        file_put_contents($tmp, hex2bin('FFD8FFE000104A46494600010101006000600000FFD9'));

        return new UploadedFile(
            $tmp,
            'test.jpg',
            'image/jpeg',
            null,
            true
        );
    }


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

        $client->request('PATCH', '/api/me/profile', content: json_encode([
            'profile' => [
                'username' => 'New Name',
                'location' => 'Strasbourg',
                'bio' => 'New bio',
            ],
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
        $this->em()->clear();
        $saved = $this->em()->find(User::class, $user->getId());
        self::assertSame('New Name', $saved->getUsername());
        self::assertSame('Strasbourg', $saved->getLocation());
        self::assertSame('New bio', $saved->getBio());
    }

    public function testUpdateAvatarOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $client = $this->authClient($client, $user);

        $originalFile = $this->makeTestJpegUpload();
        $previewFile = $this->makeTestJpegUpload();

        $action = static::getContainer()->get(UploadMediaAction::class);


        
        $originalFileId = $action($originalFile, $user->getId())->getId()->toRfc4122();
        $previewFileId = $action($previewFile, $user->getId())->getId()->toRfc4122();

        $client->request('POST', '/api/me/avatar', content: json_encode([
            'originalFileId' => $originalFileId,
            'previewFileId' => $previewFileId,
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode(['ok' => true], JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
        $this->em()->clear();
        $saved = $this->em()->find(User::class, $user->getId());
        self::assertSame($originalFileId, (string) $saved->getCurrentAvatar()->getOriginal()->getId());
        self::assertSame($previewFileId, (string) $saved->getCurrentAvatar()->getPreview()->getId());
    }

    public function testDeleteAccountOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);
        $client = $this->authClient($client, $user);
        $client->request('DELETE', '/api/me');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NO_CONTENT);
        self::assertSame('', $client->getResponse()->getContent());
        $this->em()->clear();
        self::assertNotNull($this->em()->find(User::class, $user->getId())->getDeletedAt());
    }

    public function testGetProfileOk(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $client->request('GET', '/api/users/' . $user->getId() . '/profile');

        $expectedResponse = [
            'public' => [
                'id' => (string) $user->getId(),
                'name' => $user->getUsername(),
                'slug' => $user->getSlug(),
                'avatarUrl' => null,
                'coverUrl' => null,
                'isOnline' => true,
            ],
            'privateSummary' => [
                'location' => null,
                'wallId' => (string) $user->getWall()->getId(),
                'currentEducation' => null,
                'currentWorkExperience' => null,
            ],
            'canViewPrivateSummary' => true,
            'canViewMore' => true,
        ];

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString(json_encode($expectedResponse, JSON_THROW_ON_ERROR), $client->getResponse()->getContent() ?? '');
    }

    public function testGetProfileError(): void
    {
        [$client, $user] = $this->createAuthenticatedClient([
            'email' => 'anton@test.com',
        ]);

        $fakeUser = $this->createUser([
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
