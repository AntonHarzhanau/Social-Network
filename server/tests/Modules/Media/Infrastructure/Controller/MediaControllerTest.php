<?php

namespace App\Tests\Modules\Media\Infrastructure\Controller;

use App\Tests\Support\ApiWebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;

final class MediaControllerTest extends ApiWebTestCase
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

    private function uploadOneAndGetId($client): string
    {
        $client->request('POST', '/api/media', files: ['file' => $this->makeTestJpegUpload()]);
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('id', $data);

        return (string) $data['id'];
    }

    public function testUploadMedia(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('POST', '/api/media', files: ['file' => $this->makeTestJpegUpload()]);

        $this->assertResponseStatusCodeSame(JsonResponse::HTTP_CREATED);
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);

        self::assertArrayHasKey('id', $data);
        self::assertArrayHasKey('mimeType', $data);
        self::assertSame('image/jpeg', $data['mimeType']);
        self::assertArrayHasKey('url', $data);
        self::assertNotEmpty($data['url']);
    }

    public function testUploadMediaWithoutFileReturnsBadRequest(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('POST', '/api/media');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_BAD_REQUEST);
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame(['error' => 'No file uploaded'], $data);
    }

    public function testListMediaOk(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $this->uploadOneAndGetId($client);

        // Act
        $client->request('GET', '/api/media?limit=20&offset=0');

        // Assert
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        self::assertResponseHeaderSame('content-type', 'application/json');

        $list = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);

        self::assertIsArray($list);
        self::assertNotEmpty($list);

        $first = $list[0];
        self::assertArrayHasKey('id', $first);
        self::assertArrayHasKey('mimeType', $first);
        self::assertArrayHasKey('url', $first);
        self::assertArrayHasKey('createdAt', $first);
    }

    public function testListMediaRespectsPagination(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $this->uploadOneAndGetId($client);
        $this->uploadOneAndGetId($client);

        $client->request('GET', '/api/media?limit=1&offset=0');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        $page1 = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $page1);

        $client->request('GET', '/api/media?limit=1&offset=1');
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        $page2 = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $page2);
    }

    public function testDownloadRedirectOk(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $id = $this->uploadOneAndGetId($client);

        $client->request('GET', '/api/media/' . $id);

        self::assertResponseStatusCodeSame(302);

        $location = $client->getResponse()->headers->get('Location');
        self::assertNotEmpty($location);
    }

    public function testDownloadRedirectSignedOk(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $id = $this->uploadOneAndGetId($client);

        $client->request('GET', '/api/media/' . $id . '?signed=1');

        self::assertResponseStatusCodeSame(302);

        $location = $client->getResponse()->headers->get('Location');
        self::assertNotEmpty($location);

        self::assertStringContainsString('signed=1', $location);
    }

    public function testDownloadBadUuidReturns404(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('GET', '/api/media/not-a-uuid');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NOT_FOUND);
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Not found', $data['error'] ?? null);
    }

    public function testDeleteOk(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $id = $this->uploadOneAndGetId($client);

        $client->request('DELETE', '/api/media/' . $id);

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NO_CONTENT);
    }

    public function testDeleteBadUuidReturns404(): void
    {
        [$client] = $this->createAuthenticatedClient();

        $client->request('DELETE', '/api/media/not-a-uuid');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NOT_FOUND);

        $data = json_decode($client->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Not found', $data['error'] ?? null);
    }

    public function testCannotAccessOthersMedia(): void
    {

        [$client] = $this->createAuthenticatedClient(['email' => 'userA@mail.com']);
        $id = $this->uploadOneAndGetId($client);

        $userB = $this->createUser(['email' => 'otherUser@mail.com']);
        $clientB = $this->authClient($client, $userB);

        $clientB->request('GET', '/api/media/' . $id);
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NOT_FOUND);

        $clientB->request('DELETE', '/api/media/' . $id);
        self::assertResponseStatusCodeSame(JsonResponse::HTTP_NOT_FOUND);
    }

    public function testListDoesNotShowOthersMedia(): void
    {
        [$client] = $this->createAuthenticatedClient(['email' => 'userA@mail.com']);
        $idA = $this->uploadOneAndGetId($client);

        $userB = $this->createUser(['email' => 'userB@mail.com']);
        $clientB = $this->authClient($client, $userB);
        $clientB->request('GET', '/api/media?limit=50&offset=0');

        self::assertResponseStatusCodeSame(JsonResponse::HTTP_OK);
        $listB = json_decode($clientB->getResponse()->getContent() ?? '', true, 512, JSON_THROW_ON_ERROR);

        self::assertIsArray($listB);

        $ids = array_map(static fn(array $item) => (string) ($item['id'] ?? ''), $listB);
        self::assertNotContains($idA, $ids);
    }
}
