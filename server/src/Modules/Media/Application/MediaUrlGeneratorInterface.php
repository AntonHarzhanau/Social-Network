<?php

namespace App\Modules\Media\Application;

use App\Modules\Media\Domain\Entity\MediaAsset;

interface MediaUrlGeneratorInterface
{
    public function getPublicUrl(MediaAsset $media): string;
}
