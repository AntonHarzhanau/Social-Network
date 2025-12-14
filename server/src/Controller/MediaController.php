<?php

namespace App\Controller;

use App\Entity\MediaAsset;
use App\Modules\Identity\Domain\Entity\User;
use App\Service\Media\MediaStorageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/media')]
final class MediaController extends AbstractController
{

    public function __construct(
        private readonly MediaStorageService $mediaStorage,
        private EntityManagerInterface $em,
    ) {}

    #[Route('', name: 'upload_media', methods: ['POST'], format: 'json')]
    public function upload(Request $request, #[CurrentUser] User $user): JsonResponse
    {

        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], 400);
        }

        $media = $this->mediaStorage->storeFile($file, $user);

        return $this->json($media, JsonResponse::HTTP_CREATED);
    }

    #[Route('', name: 'list_media', methods: ['GET'], format: 'json')]
    public function listMedia(#[CurrentUser] User $user): JsonResponse
    {
        $repo = $this->em->getRepository(MediaAsset::class);

        $items = $repo->findAll();

        $data = array_map(function (MediaAsset $media) {
            return [
                'id' => $media->getId(),
                'fileType' => $media->getFileType(),
                'mimeType' => $media->getMimeType(),
                'sizeByte' => $media->getSizeByte(),
                'url' => $this->mediaStorage->getPublicUrl($media),
                'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
            ];
        }, $items);
        return $this->json($data);
    }

    
    #[Route('/{id}', name: 'download_media', methods: ['GET'], format: 'json')]
    public function download(string $id): Response
    {
        $repo = $this->em->getRepository(MediaAsset::class);
        $media = $repo->find($id);

        if (!$media || $media->getDeletedAt()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $url = $this->mediaStorage->getPublicUrl($media);

        return new RedirectResponse($url, 302);
    }


    #[Route('/{id}', name: 'delete_media', methods: ['DELETE'], format: 'json')]
    public function delete(MediaAsset $media): JsonResponse
    {
        if ($media->getDeletedAt()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $this->mediaStorage->delete($media);

        return $this->json(null, 204);
    }
}
