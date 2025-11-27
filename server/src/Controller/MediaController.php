<?php

namespace App\Controller;

use App\Entity\MediaAssets;
use App\Entity\User;
use App\Service\MediaStorageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
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

        return $this->json([
            'id' => $media->getId(),
            'fileType' => $media->getFileType(),
            'mimeType' => $media->getMimeType(),
            'sizeByte' => $media->getSizeByte(),
            'storageKey' => $media->getStorageKey(),
            'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
        ], 201);
    }

    #[Route('', name: 'list_media', methods: ['GET'], format: 'json')]
    public function listMedia(#[CurrentUser] User $user): JsonResponse
    {
        $repo = $this->em->getRepository(MediaAssets::class);

        $items = $repo->findAll();

        $data = array_map(function (MediaAssets $media) {
            return [
                'id' => $media->getId(),
                'fileType' => $media->getFileType(),
                'mimeType' => $media->getMimeType(),
                'sizeByte' => $media->getSizeByte(),
                'storageKey' => $media->getStorageKey(),
                'createdAt' => $media->getCreatedAt()->format(\DateTime::ATOM),
            ];
        }, $items);
        return $this->json($data);
    }

    #[Route('/{id}', name: 'download_media', methods: ['GET'], format: 'json')]
    public function download(string $id): Response
    {
        $repo = $this->em->getRepository(MediaAssets::class);

        $media = $repo->find($id);

        if (!$media || $media->getDeletedAt()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $path = $this->mediaStorage->getFilesystemPath($media);
        if (!is_file($path)) {
            return $this->json(['error' => 'File missing'], 500);
        }

        $response = new BinaryFileResponse($path);
        $response->headers->set('Content-Type', $media->getMimeType() ?? 'application/octet-stream');
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            'file'
        );

        return $response;
    }
}
