<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\User\Application\Action\Me\AttachMediaAction;
use App\Modules\User\Application\Action\Me\DeleteAccountAction;
use App\Modules\User\Application\Action\Me\Education\AddEducationAction;
use App\Modules\User\Application\Action\Me\Education\DeleteEducationAction;
use App\Modules\User\Application\Action\Me\Education\UpdateEducationAction;
use App\Modules\User\Application\Action\Me\GetMeAction;
use App\Modules\User\Application\Action\Me\PatchProfileSettingsAction;
use App\Modules\User\Application\Action\Me\UpdateUserAvatarAction;
use App\Modules\User\Application\Action\Me\WorkExperience\AddWorkExperienceAction;
use App\Modules\User\Application\Action\Me\WorkExperience\DeleteWorkExperienceAction;
use App\Modules\User\Application\Action\Me\WorkExperience\UpdateWorkExperienceAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Infrastructure\Http\Request\AttachMediaRequest;
use App\Modules\User\Infrastructure\Http\Request\CreateEducationRequest;
use App\Modules\User\Infrastructure\Http\Request\CreateWorkExperienceRequest;
use App\Modules\User\Infrastructure\Http\Request\UpdateAvatarRequest;
use App\Modules\User\Infrastructure\Http\Request\PatchProfileSettingsRequest;
use App\Modules\User\Infrastructure\Http\Request\UpdateEducationRequest;
use App\Modules\User\Infrastructure\Http\Request\UpdateWorkExperienceRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/me')]
final class MeController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function me(
        #[CurrentUser] User $user,
        GetMeAction $action,
    ): JsonResponse {
        return $this->json($action->execute($user->getId()));
    }

    #[Route('', methods: ['DELETE'])]
    public function deleteAccount(
        #[CurrentUser] User $user,
        DeleteAccountAction $action,
    ): JsonResponse {
        $action->execute($user->getId());

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }


    #[Route('/profile', methods: ['PATCH'])]
    public function updateProfile(
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] PatchProfileSettingsRequest $dto,
        PatchProfileSettingsAction $action,
    ): JsonResponse {
        $action->execute($user, $dto);
        return $this->json(['ok' => true], Response::HTTP_OK);
    }

    #[Route('/profile/education', methods: ['POST'], format: 'json')]
    public function addEducation(
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] CreateEducationRequest $dto,
        AddEducationAction $action,
    ): JsonResponse {
        $id = $action->execute($user, $dto);
        return $this->json(['id' => $id], Response::HTTP_OK);
    }

    #[Route('/profile/education/{educationId}', methods: ['PUT'], format: 'json')]
    public function updateEducation(
        string $educationId,
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateEducationRequest $dto,
        UpdateEducationAction $action,
    ): JsonResponse {
        $id = $action->execute($user, Uuid::fromString($educationId), $dto);
        return $this->json(['id' => $id], Response::HTTP_OK);
    }

    #[Route('/profile/education/{educationId}', methods: ['DELETE'], format: 'json')]
    public function deleteEducation(
        string $educationId,
        #[CurrentUser] User $user,
        DeleteEducationAction $action,
    ): JsonResponse {

        $action->execute($user, Uuid::fromString($educationId));
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/profile/work-experience', methods: ['POST'], format: 'json')]
    public function addWorkExperience(
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] CreateWorkExperienceRequest $dto,
        AddWorkExperienceAction $action,
    ): JsonResponse {
        $id = $action->execute($user, $dto);
        return $this->json(['id' => $id], Response::HTTP_OK);
    }

    #[Route('/profile/work-experience/{workExperienceId}', methods: ['PUT'], format: 'json')]
    public function updateWorkExperience(
        string $workExperienceId,
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateWorkExperienceRequest $dto,
        UpdateWorkExperienceAction $action,
    ): JsonResponse {
        $id = $action->execute($user, Uuid::fromString($workExperienceId), $dto);
        return $this->json(['id' => $id], Response::HTTP_OK);
    }

    #[Route('/profile/work-experience/{workExperienceId}', methods: ['DELETE'], format: 'json')]
    public function deleteWorkExperience(
        string $workExperienceId,
        #[CurrentUser] User $user,
        DeleteWorkExperienceAction $action,
    ): JsonResponse {
        $action->execute($user, Uuid::fromString($workExperienceId));
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/avatar', methods: ['POST'])]
    public function updateAvatar(
        #[CurrentUser] User $user,
        #[MapRequestPayload(validationFailedStatusCode: 422)] UpdateAvatarRequest $dto,
        UpdateUserAvatarAction $action,
    ): JsonResponse {
        $action->execute($user->getId(), $dto->originalFileId, $dto->previewFileId);

        return $this->json(['ok' => true], Response::HTTP_OK);
    }

    #[Route('/media', methods: ['POST'])]
    public function attachMedia(
        #[CurrentUser()] User $currentUser,
        AttachMediaAction $action,
        #[MapRequestPayload()] AttachMediaRequest $payload
    ): JsonResponse {
        $response = $action->execute($currentUser->getId(), $payload->mediaIds);

        return $this->json($response, Response::HTTP_OK);
    }
}
