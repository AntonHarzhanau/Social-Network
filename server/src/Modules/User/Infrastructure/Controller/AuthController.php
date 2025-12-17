<?php

namespace App\Modules\User\Infrastructure\Controller;

use App\Modules\User\Application\Action\GetMeAction;
use App\Modules\User\Application\Action\RegisterUserAction;
use App\Modules\User\Application\Action\VerifyEmailAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Infrastructure\Http\Request\RegisterRequest;
use App\Modules\User\Infrastructure\Http\Request\VerifyEmailRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload(validationFailedStatusCode: JsonResponse::HTTP_UNPROCESSABLE_ENTITY)] RegisterRequest $dto,
        Request $request,
        RegisterUserAction $action,
        EventDispatcherInterface $eventDispatcher,
    ): JsonResponse {
        $userIp = $request->getClientIp();
        $userAgent = $request->headers->get('User-Agent');

        $event = $action(
            $dto->email,
            $dto->firstName,
            $dto->lastName,
            $dto->password,
            $dto->dateOfBirth,
            $userIp,
            $userAgent,
        );

        $eventDispatcher->dispatch($event);

        return $this->json(['ok' => true], JsonResponse::HTTP_CREATED);
    }

    #[Route('/verify-email', methods: ['POST'])]
    public function verifyEmail(
        #[MapRequestPayload(validationFailedStatusCode: JsonResponse::HTTP_UNPROCESSABLE_ENTITY)] VerifyEmailRequest $dto,
        VerifyEmailAction $action,
    ): JsonResponse {
        $action($dto->token);
        return $this->json(['ok' => true]);
    }

    #[Route('/me', methods: ['GET'])]
    public function me(
        #[CurrentUser] ?User $user,
        GetMeAction $action,
    ): JsonResponse {
        return $this->json($action($user->getId()));
    }
}
