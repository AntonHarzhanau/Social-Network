<?php

namespace App\Modules\Media\Application\Action;

use App\Modules\Media\Application\Port\MediaMetadataExtractorInterface;
use App\Modules\Media\Application\Port\MediaStorageInterface;
use App\Modules\Media\Application\Service\FileTypeDetector;
use App\Modules\Media\Domain\Entity\MediaAsset;
use App\Modules\Media\Domain\Repository\MediaAssetRepositoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Uid\Uuid;

final class UploadMediaAction
{
    public function __construct(
        private readonly MediaAssetRepositoryInterface $mediaAssetRepository,
        private readonly MediaStorageInterface $storage,
        private readonly FileTypeDetector $fileTypeDetector,
        private readonly UserApiInterface $userApi,
        private readonly MediaMetadataExtractorInterface $metadataExtractor,
    ) {}

    public function __invoke(UploadedFile $file, Uuid $ownerId): MediaAsset
    {
        $now = new \DateTimeImmutable();
        $owner = $this->userApi->findById($ownerId);

        $size = $file->getSize() ?? 0;
        $mime = $file->getMimeType() ?? 'application/octet-stream';

        $fileType = $this->fileTypeDetector->detect($mime);

        $localPath = $file->getPathname();
        $meta = $this->metadataExtractor->extract($localPath, $fileType, $mime);

        $subdir = $now->format('Y/m/d');
        $uuid = Uuid::v4()->toRfc4122();
        $extension = $file->guessExtension() ?? 'bin';

        $storageKey = sprintf('%s/%s.%s', $subdir, $uuid, $extension);

        $media = (new MediaAsset())
            ->setOwner($owner)
            ->setStorageKey($storageKey)
            ->setMimeType($mime)
            ->setSizeByte($size)
            ->setFileType($fileType)
            ->setCreatedAt($now)
            ->setWidth($meta->width)
            ->setHeight($meta->height)
            ->setDurationSeconds($meta->durationSeconds);

        try {
            $this->storage->store($file, $storageKey, $mime);
            $this->mediaAssetRepository->save($media, true);
        } catch (\Throwable $e) {
            try {
                $this->storage->delete($storageKey);
            } catch (\Throwable) {
            }
            throw $e;
        }

        return $media;
    }
}
