<?php

namespace App\Modules\Media\Application;

use App\DTO\Media\MediaResponseDTO;
use App\Enum\FileTypeEnum;
use App\Factory\Media\MediaFactory;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Media\Domain\Entity\MediaAsset;
use Aws\S3\S3Client;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Uid\Uuid;

class MediaStorageService implements MediaUrlGeneratorInterface
{
    public function __construct(
        private S3Client $s3,
        #[Autowire(env: 'AWS_BUCKET')]
        private string $bucket,
        private EntityManagerInterface $em,
        private MediaFactory $mediaFactory,
    ) {}

    public function storeFile(UploadedFile $file, User $owner): MediaResponseDTO
    {

        $size = $file->getSize();
        $mime = $file->getClientMimeType() ?? 'application/octet-stream';

        $now = new \DateTimeImmutable();
        $subbdir = $now->format('Y/m/d');
        $uuid = Uuid::v4()->toRfc4122();
        $extension = $file->guessExtension() ?? 'bin';
        $filename = $uuid . '.' . $extension;

        $key = $subbdir . '/' . $filename;

        $this->s3->putObject([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'Body' => fopen($file->getPathname(), 'rb'),
            'ContentType' => $mime,
            'ContentLength' => $size,
        ]);

        $media = new MediaAsset();
        $media
            ->setOwner($owner)
            ->setStorageKey($key)
            ->setMimeType($mime)
            ->setSizeByte($size)
            ->setFileType($this->detectFileType($mime))
            ->setCreatedAt($now);

        $this->em->persist($media);
        $this->em->flush();

        return $this->mediaFactory->toResponseDTO($media, $this->getPublicUrl($media));
    }

    public function getPublicUrl(MediaAsset $media): string
    {
        $endpoint = rtrim((string) $this->s3->getEndpoint(), '/');
        return sprintf('%s/%s/%s', $endpoint, $this->bucket, $media->getStorageKey());
    }

    public function getSignedUrl(MediaAsset $media, int $ttlSeconds = 3600): string
    {
        $cmd = $this->s3->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $media->getStorageKey(),
        ]);

        $request = $this->s3->createPresignedRequest($cmd, sprintf('+%d seconds', $ttlSeconds));
        return (string) $request->getUri();
    }

    public function delete(MediaAsset $media): void
    {
        $this->s3->deleteObject([
            'Bucket' => $this->bucket,
            'Key' => $media->getStorageKey(),
        ]);

        $this->em->remove($media);
        $this->em->flush();
    }

    private function detectFileType(?string $mimeType): FileTypeEnum
    {

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
