<?php

namespace App\Modules\User\Infrastructure\Http\Request;

use App\Modules\User\Domain\Enum\MaritalStatusEnum;
use App\Modules\User\Domain\Enum\ProfileVisibilityEnum;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

final class PatchProfileSettingsRequest
{
    #[Assert\Type(
        type: 'array',
        message: 'Field "profile" must be an object.'
    )]
    #[Assert\Collection(
        fields: [
            'username' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "profile.username" must be a string.'),
                new Assert\NotBlank(message: 'Field "profile.username" cannot be empty.'),
                new Assert\Length(
                    min: 3,
                    max: 100,
                    minMessage: 'Field "profile.username" must be at least {{ limit }} characters.',
                    maxMessage: 'Field "profile.username" must be at most {{ limit }} characters.'
                ),
            ]),

            'location' => new Assert\Optional([
                new Assert\Type(
                    type: ['string', 'null'],
                    message: 'Field "profile.location" must be a string or null.'
                ),
                new Assert\Length(
                    max: 100,
                    maxMessage: 'Field "profile.location" must be at most {{ limit }} characters.'
                ),
            ]),

            'maritalStatus' => new Assert\Optional([
                new Assert\Type(
                    type: ['string', 'null'],
                    message: 'Field "profile.maritalStatus" must be a string or null.'
                ),
                new Assert\Length(
                    max: 30,
                    maxMessage: 'Field "profile.maritalStatus" must be at most {{ limit }} characters.'
                ),
                new Assert\Choice(
                    callback: [MaritalStatusEnum::class, 'valuesWithNull'],
                    message: 'Field "profile.maritalStatus" must be one of: single, married, divorced, widowed, or null.'
                ),
            ]),

            'dateOfBirth' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "profile.dateOfBirth" must be a string in format YYYY-MM-DD.'),
                new Assert\NotBlank(message: 'Field "profile.dateOfBirth" cannot be empty.'),
                new Assert\Regex(
                    pattern: '/^\d{4}-\d{2}-\d{2}$/',
                    message: 'Field "profile.dateOfBirth" must match format YYYY-MM-DD.'
                ),
            ]),

            'bio' => new Assert\Optional([
                new Assert\Type(
                    type: ['string', 'null'],
                    message: 'Field "profile.bio" must be a string or null.'
                ),
                new Assert\Length(
                    max: 2000,
                    maxMessage: 'Field "profile.bio" must be at most {{ limit }} characters.'
                ),
            ]),
        ],
        allowExtraFields: false,
        extraFieldsMessage: 'Unknown field "{{ field }}" inside "profile".'
    )]
    public array $profile = [];

    #[Assert\Type(
        type: 'array',
        message: 'Field "privacy" must be an object.'
    )]
    #[Assert\Collection(
        fields: [
            'postsVisibility' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "privacy.postsVisibility" must be a string.'),
                new Assert\Choice(
                    callback: [ProfileVisibilityEnum::class, 'values'],
                    message: 'Field "privacy.postsVisibility" must be one of: public, friends, private.'
                ),
            ]),
            'mediaVisibility' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "privacy.mediaVisibility" must be a string.'),
                new Assert\Choice(
                    callback: [ProfileVisibilityEnum::class, 'values'],
                    message: 'Field "privacy.mediaVisibility" must be one of: public, friends, private.'
                ),
            ]),
            'friendsVisibility' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "privacy.friendsVisibility" must be a string.'),
                new Assert\Choice(
                    callback: [ProfileVisibilityEnum::class, 'values'],
                    message: 'Field "privacy.friendsVisibility" must be one of: public, friends, private.'
                ),
            ]),
            'profileVisibility' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "privacy.profileVisibility" must be a string.'),
                new Assert\Choice(
                    callback: [ProfileVisibilityEnum::class, 'values'],
                    message: 'Field "privacy.profileVisibility" must be one of: public, friends, private.'
                ),
            ]),
            'groupsVisibility' => new Assert\Optional([
                new Assert\Type(type: 'string', message: 'Field "privacy.groupsVisibility" must be a string.'),
                new Assert\Choice(
                    callback: [ProfileVisibilityEnum::class, 'values'],
                    message: 'Field "privacy.groupsVisibility" must be one of: public, friends, private.'
                ),
            ]),
        ],
        allowExtraFields: false,
        extraFieldsMessage: 'Unknown field "{{ field }}" inside "privacy".'
    )]
    public array $privacy = [];

    #[Assert\Callback]
    public function validateAtLeastOneField(ExecutionContextInterface $context): void
    {
        $hasProfile = \is_array($this->profile) && \count($this->profile) > 0;
        $hasPrivacy = \is_array($this->privacy) && \count($this->privacy) > 0;

        if (!$hasProfile && !$hasPrivacy) {
            $context
                ->buildViolation('Provide at least one field inside "profile" or "privacy".')
                ->addViolation();
        }
    }
}
