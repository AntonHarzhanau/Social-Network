<?php

namespace App\Service\Media;

use App\Entity\MediaAsset;

interface MediaUrlGeneratorInterface
{
    public function getPublicUrl(MediaAsset $media): string;
}
