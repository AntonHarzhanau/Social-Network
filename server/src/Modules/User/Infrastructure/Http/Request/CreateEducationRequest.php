<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

final class CreateEducationRequest
{
    #[Assert\Type(type: 'string', message: 'Field "institutionName" must be a string.')]
    #[Assert\NotBlank(message: 'Field "institutionName" cannot be empty.')]
    #[Assert\Length(
        max: 150,
        maxMessage: 'Field "institutionName" must be at most {{ limit }} characters.'
    )]
    public string $institutionName;

    #[Assert\Type(type: ['string', 'null'], message: 'Field "programName" must be a string or null.')]
    #[Assert\Length(
        max: 150,
        maxMessage: 'Field "programName" must be at most {{ limit }} characters.'
    )]
    public ?string $programName = null;

    #[Assert\Type(type: ['string', 'null'], message: 'Field "degree" must be a string or null.')]
    #[Assert\Length(
        max: 100,
        maxMessage: 'Field "degree" must be at most {{ limit }} characters.'
    )]
    public ?string $degree = null;

    #[Assert\Type(type: 'string', message: 'Field "startAt" must be a string in format YYYY-MM-DD.')]
    #[Assert\NotBlank(message: 'Field "startAt" cannot be empty.')]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}$/',
        message: 'Field "startAt" must match format YYYY-MM-DD.'
    )]
    public string $startAt;

    #[Assert\Type(type: ['string', 'null'], message: 'Field "endAt" must be a string in format YYYY-MM-DD or null.')]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}$/',
        message: 'Field "endAt" must match format YYYY-MM-DD.',
        match: true,
        normalizer: null
    )]
    public ?string $endAt = null;

    #[Assert\Callback]
    public function validateDates(ExecutionContextInterface $context): void
    {
        $start = \DateTimeImmutable::createFromFormat('Y-m-d', $this->startAt);
        if (!$start) {
            $context->buildViolation('Field "startAt" is not a valid date.')->atPath('startAt')->addViolation();
            return;
        }

        if ($this->endAt === null) {
            return;
        }

        $end = \DateTimeImmutable::createFromFormat('Y-m-d', $this->endAt);
        if (!$end) {
            $context->buildViolation('Field "endAt" is not a valid date.')->atPath('endAt')->addViolation();
            return;
        }

        if ($end < $start) {
            $context
                ->buildViolation('Field "endAt" must be greater than or equal to "startAt".')
                ->atPath('endAt')
                ->addViolation();
        }
    }
}
