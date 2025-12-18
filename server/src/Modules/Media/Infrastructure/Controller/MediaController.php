<?php

namespace App\Modules\Media\Infrastructure\Controller;

use App\Modules\Media\Application\Action\DeleteMediaAction;
use App\Modules\Media\Application\Action\GetMediaDownLoadUrlAction;
use App\Modules\Media\Application\Action\ListMyMediaAction;
use App\Modules\Media\Application\Action\UploadMediaAction;
use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\User\Domain\Entity\User;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/media')]
final class MediaController extends AbstractController
{

    public function __construct(
        private readonly UploadMediaAction $uploadMedia,
        private readonly ListMyMediaAction $listMyMedia,
        private readonly DeleteMediaAction $deleteMedia,
        private readonly GetMediaDownLoadUrlAction $getDownLoadUrl,
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
    ) {}

    #[Route('', name: 'upload_media', methods: ['POST'], format: 'json')]
    public function upload(Request $request, #[CurrentUser] User $user): JsonResponse
    {

        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], 400);
        }

        $media = ($this->uploadMedia)($file, $user);

        return $this->json([
            'id' => $media->getId(),
            'fileType' => $media->getFileType(),
            'mimeType' => $media->getMimeType(),
            'sizeByte' => $media->getSizeByte(),
            'url' => ($this->getDownLoadUrl)($media),
            'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('', name: 'list_media', methods: ['GET'], format: 'json')]
    public function listMedia(#[CurrentUser] User $user, Request $request): JsonResponse
    {
        $limit = max(1, min(100, (int) $request->query->get('limit', '20')));
        $offset = max(0, (int) $request->query->get('offset', '0'));

        $items = ($this->listMyMedia)($user->getId(), $limit, $offset);

        $data = array_map(function (MediaAsset $media) {
            return [
                'id' => $media->getId(),
                'fileType' => $media->getFileType(),
                'mimeType' => $media->getMimeType(),
                'sizeByte' => $media->getSizeByte(),
                'url' => ($this->getDownLoadUrl)($media),
                'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
            ];
        }, $items);
        return $this->json($data, JsonResponse::HTTP_OK);
    }


    #[Route('/{id}', name: 'download_media', methods: ['GET'], format: 'json')]
    public function download(string $id, #[CurrentUser] User $user, Request $request): Response
    {
       try {
        $uuid = Uuid::fromString($id);
       } catch (\Throwable $e) {
        return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
       }

       $media = $this->mediaAssetRepository->findById($uuid);
       if (!$media || $media->getOwner()->getId() !== $user->getId()) {
        return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
       }

       $signed = (bool) $request->query->get('signed', false);
       $url = ($this->getDownLoadUrl)($media, $signed);
       return new RedirectResponse($url, Response::HTTP_FOUND);

    }


    #[Route('/{id}', name: 'delete_media', methods: ['DELETE'], format: 'json')]
    public function delete(string $id, #[CurrentUser] User $user): JsonResponse
    {
       try {
        $uuid = Uuid::fromString($id);
       } catch (\Throwable $e) {
        return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
       }

       $media = $this->mediaAssetRepository->findById($uuid);
       if (!$media || $media->getOwner()->getId() !== $user->getId()) {
        return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
       }

       ($this->deleteMedia)($media);

       return $this->json(null, JsonResponse::HTTP_NO_CONTENT);
    }

}
