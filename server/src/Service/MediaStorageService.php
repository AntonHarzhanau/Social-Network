<?php

namespace App\Service;

use App\Entity\MediaAsset;
use App\Entity\User;
use App\Enum\FileTypeEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Uid\Uuid;

class MediaStorageService
{
    public function __construct(
        #[Autowire('%media_storage_root%')]
        private string $mediaStorageRoot,
        private EntityManagerInterface $em,
    ) {}

    public function storeFile(UploadedFile $file, User $owner): MediaAsset
    {

        $size = $file->getSize();
        $mime = $file->getClientMimeType();

        $now = new \DateTimeImmutable();
        $subbdir = $now->format('Y/m/d');
        $targetDir = $this->mediaStorageRoot . '/' . $subbdir;

        if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $targetDir));
        }

        $uuid = Uuid::v4()->toRfc4122();
        $extension = $file->guessExtension() ?? 'bin';
        $filename = $uuid . '.' . $extension;

        $file->move($targetDir, $filename);

        $storageKey = $subbdir . '/' . $filename;

        $media = new MediaAsset();
        $media
            ->setOwner($owner)
            ->setStorageKey($storageKey)
            ->setMimeType($mime)
            ->setSizeByte($size)
            ->setFileType($this->detectFileType($mime))
            ->setCreatedAt($now);
        
        $this->em->persist($media);
        $this->em->flush();

        return $media;
    }

    public function getFilesystemPath(MediaAsset $media): string
    {
        return $this->mediaStorageRoot . '/' . $media->getStorageKey();
    }

    public function delete(MediaAsset $media): void
    {
        $path = $this->getFilesystemPath($media);
        if (is_file($path)) {
            unlink($path);
        }
        $this->em->remove($media);
        $this->em->flush();
    }

    private function detectFileType(?string $mimeType): FileTypeEnum
    {
        if ($mimeType === null) {
            return FileTypeEnum::OTHER;
        }

        if (str_starts_with($mimeType, 'image/')) {
            return FileTypeEnum::IMAGE;
        }

        if (str_starts_with($mimeType, 'video/')) {
            return FileTypeEnum::VIDEO;
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return FileTypeEnum::AUDIO;
        }

        if (in_array($mimeType, ['application/pdf', 'application/msword'])) {
            return FileTypeEnum::DOCUMENT;
        }

        return FileTypeEnum::OTHER;
    }
    
}
