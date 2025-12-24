<?php

namespace App\Modules\Chat\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

final class CreateChatRequest
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    public string $title;

    #[Assert\Type('string')]
    #[Assert\Url(['protocols' => ['http', 'https']])]
    public ?string $avatarUrl = null;

    #[Assert\NotBlank]
    #[Assert\Type('array')]
    #[Assert\Count(min: 1)]
    #[Assert\All([
        new Assert\Type('string'),
        new Assert\Uuid(),
    ])]
    public array $participantIds;

    #[Assert\Callback]
    public function validateUniqueParticipantIds(ExecutionContextInterface $context): void
    {
        $normalized = array_map('strtolower', $this->participantIds);

        if (count($normalized) !== count(array_unique($normalized))) {
            $context->buildViolation('participantIds must not contain duplicates.')
                ->atPath('participantIds')
                ->addViolation();
        }
    }
}
