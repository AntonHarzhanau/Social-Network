<?php

namespace App\Modules\Shared\Infrastructure\Persistence\Doctrine\Mapper;

use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

readonly abstract class AbstractDoctrineMapper
{
    const DOMAIN_CLASS_NAME = '';
    const DOCTRINE_CLASS_NAME = '';

    public function __construct(
        protected NormalizerInterface&DenormalizerInterface $serializer,

    ) {}

    public function toDoctrine(object $domainObject, ?object $populate = null): object
    {
        $data = $this->serializer->normalize($domainObject);

        if (!\is_array($data)) {
            throw new \LogicException('normalize() must return array.');
        }

        $data = \array_filter($data, static fn($v) => $v !== null);

        $context = $populate
            ? [AbstractObjectNormalizer::OBJECT_TO_POPULATE => $populate]
            : [];

        return $this->serializer->denormalize(
            $data,
            static::DOCTRINE_CLASS_NAME,
            null,
            $context
        );
    }

    public function fromDoctrine(object $doctrineObject): object
    {
        $normalizedData = \array_filter($this->serializer->normalize($doctrineObject));
        return $this->serializer->denormalize(
            $normalizedData,
            static::DOMAIN_CLASS_NAME
        );
    }
}
