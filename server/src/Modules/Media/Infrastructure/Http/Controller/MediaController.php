<?php

namespace App\Modules\Media\Infrastructure\Http\Controller;

use App\Modules\Media\Application\Action\DeleteMediaAction;
use App\Modules\Media\Application\Action\GetOneAction;
use App\Modules\Media\Application\Action\LikeMediaAction;
use App\Modules\Media\Application\Action\ListMediaAction;
use App\Modules\Media\Application\Service\GetMediaUrl;
use App\Modules\Media\Application\Action\UploadMediaAction;
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
use Symfony\Component\Validator\Constraints\Json;

#[Route('/api/media')]
final class MediaController extends AbstractController
{

    public function __construct(
        private readonly UploadMediaAction $uploadMedia,
        private readonly ListMediaAction $listMyMedia,
        private readonly DeleteMediaAction $deleteMedia,
        private readonly GetMediaUrl $getMediaUrl,
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
    ) {}

    #[Route('', name: 'upload_media', methods: ['POST'], format: 'json')]
    public function upload(Request $request, #[CurrentUser] User $user): JsonResponse
    {
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $media = ($this->uploadMedia)($file, $user->getId());

        return $this->json([
            'id' => $media->getId()->toRfc4122(),
            'fileType' => $media->getFileType()?->value,
            'mimeType' => $media->getMimeType(),
            'sizeByte' => $media->getSizeByte(),
            'url' => ($this->getMediaUrl)($media->getStorageKey()),
            'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
            'width' => $media->getWidth(),
            'height' => $media->getHeight(),
            'durationSeconds' => $media->getDurationSeconds(),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('', name: 'list_media', methods: ['GET'], format: 'json')]
    public function listMedia(#[CurrentUser] User $user, Request $request): JsonResponse
    {
        $limit = max(1, min(100, (int) $request->query->get('limit', '20')));
        $offset = max(0, (int) $request->query->get('offset', '0'));

        $items = ($this->listMyMedia)($user->getId(), $limit, $offset);

        return $this->json($items, JsonResponse::HTTP_OK);
    }


    #[Route('/{id}', name: 'get_one', methods: ['GET'], format: 'json')]
    public function getOne(string $id, #[CurrentUser] User $user, GetOneAction $getOneAction): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($id);
        } catch (\Throwable $e) {
            return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $media = $getOneAction->execute($user->getId(), $uuid);
        if (!$media) {
            return $this->json(['error' => 'Not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($media, JsonResponse::HTTP_OK);
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

    #[Route('/{id}/like', name: 'like_media', methods: ['POST'], format: 'json')]
    public function like(string $id, #[CurrentUser] User $user, LikeMediaAction $action): JsonResponse
    {
        $response = $action->execute(Uuid::fromString($id), $user->getId());
        return $this->json([
            $response,
        ], JsonResponse::HTTP_OK);
    }
}
