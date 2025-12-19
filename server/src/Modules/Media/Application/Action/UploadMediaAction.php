<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\Port\MediaStorageInterface;
use App\Modules\Media\Application\Service\FileTypeDetector;
use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use App\Modules\User\Domain\Entity\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Uid\Uuid;

final class UploadMediaAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
        private readonly MediaStorageInterface $storage,
        private readonly FileTypeDetector $fileTypeDetector,
    ) {}

    public function __invoke(UploadedFile $file, User $owner): MediaAsset
    {
        $now = new \DateTimeImmutable();

        $size = $file->getSize() ?? 0;
        $mime = $file->getMimeType() ?? 'application/octet-stream';

        $subdir = $now->format('Y/m/d');
        $uuid = Uuid::v4()->toRfc4122();
        $extension = $file->guessExtension() ?? 'bin';

        $storageKey = sprintf('%s/%s.%s', $subdir, $uuid, $extension);


        $media = (new MediaAsset())
            ->setOwner($owner)
            ->setStorageKey($storageKey)
            ->setMimeType($mime)
            ->setSizeByte($size)
            ->setFileType($this->fileTypeDetector->detect($mime))
            ->setCreatedAt($now);

        try {
            $this->storage->store($file, $storageKey, $mime);
            $this->mediaAssetRepository->save($media, true);
        } catch (\Throwable $e) {
            try {
                $this->storage->delete($storageKey);
            } catch (\Throwable) {
                // Ignore cleanup failur
            }
            throw $e;
        }

        return $media;
    }
}
