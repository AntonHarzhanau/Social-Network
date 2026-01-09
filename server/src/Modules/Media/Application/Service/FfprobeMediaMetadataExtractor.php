<?php

namespace App\Modules\Media\Application\Service;

use App\Modules\Media\Application\DTO\MediaMetadata;
use App\Modules\Media\Application\Port\MediaMetadataExtractorInterface;
use App\Modules\Media\Domain\Enum\FileTypeEnum;
use Symfony\Component\Process\Process;

final class FfprobeMediaMetadataExtractor implements MediaMetadataExtractorInterface
{
    public function extract(string $localPath, FileTypeEnum $fileType, ?string $mimeType = null): MediaMetadata
    {
        if (!is_file($localPath)) {
            return new MediaMetadata();
        }

        // Images: fast and simple
        if ($fileType === FileTypeEnum::IMAGE) {
            $info = @getimagesize($localPath);
            if (!$info || empty($info[0]) || empty($info[1])) {
                return new MediaMetadata();
            }
            return new MediaMetadata(width: (int) $info[0], height: (int) $info[1]);
        }

        // Videos: use ffprobe (width/height + duration)
        if ($fileType === FileTypeEnum::VIDEO) {
            return $this->probeVideo($localPath);
        }

        return new MediaMetadata();
    }

    private function probeVideo(string $path): MediaMetadata
    {
        // width/height from first video stream
        $process = new Process([
            'ffprobe',
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'json',
            $path,
        ]);

        $process->run();

        $width = null;
        $height = null;

        if ($process->isSuccessful()) {
            $json = json_decode($process->getOutput(), true);
            $stream = $json['streams'][0] ?? null;
            if (is_array($stream)) {
                $width = isset($stream['width']) ? (int) $stream['width'] : null;
                $height = isset($stream['height']) ? (int) $stream['height'] : null;
            }
        }

        // duration from container format (optional)
        $duration = null;
        $durProcess = new Process([
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            $path,
        ]);
        $durProcess->run();

        if ($durProcess->isSuccessful()) {
            $raw = trim($durProcess->getOutput());
            if ($raw !== '' && is_numeric($raw)) {
                $duration = (float) $raw;
            }
        }

        return new MediaMetadata($width, $height, $duration);
    }
}
