<?php

namespace App\Modules\User\Infrastructure\Controller;

use App\Modules\User\Application\Action\ConfirmAccountRecoveryAction;
use App\Modules\User\Application\Action\GetMeAction;
use App\Modules\User\Application\Action\RecoveryAccountRequestAction;
use App\Modules\User\Application\Action\RegisterUserAction;
use App\Modules\User\Application\Action\RequestAccountRecoveryAction;
use App\Modules\User\Application\Action\RestoreAccountAction;
use App\Modules\User\Application\Action\VerifyEmailAction;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Infrastructure\Http\Request\RecoveryAccountRequest;
use App\Modules\User\Infrastructure\Http\Request\RegisterRequest;
use App\Modules\User\Infrastructure\Http\Request\VerifyEmailRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    public function __construct(
        private readonly string $frontendBaseUrl = 'http://localhost:5173/auth'
    ) {}

    #[Route('/register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload(validationFailedStatusCode: JsonResponse::HTTP_UNPROCESSABLE_ENTITY)] RegisterRequest $dto,
        Request $request,
        RegisterUserAction $action,
        EventDispatcherInterface $eventDispatcher,
    ): JsonResponse {
        $userIp = $request->getClientIp();
        $userAgent = $request->headers->get('User-Agent');

        try {
            $event = $action(
                $dto->email,
                $dto->firstName,
                $dto->lastName,
                $dto->password,
                $dto->dateOfBirth,
                $userIp,
                $userAgent,
            );
        } catch (\DomainException $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_CONFLICT);
        }

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

    #[Route('/recovery/request', methods: ['POST'])]
    public function recoveryRequest(
        #[MapRequestPayload(validationFailedStatusCode: JsonResponse::HTTP_UNPROCESSABLE_ENTITY)] RecoveryAccountRequest $dto,
        RequestAccountRecoveryAction $action,
    ): JsonResponse {
        $action($dto->email);
        return $this->json(['message' => 'A recovery request has been sent to the specified address.
Check your email.'], JsonResponse::HTTP_ACCEPTED);
    }

    #[Route('/recovery/confirm', name: 'api_auth_recovery_confirm', methods: ['GET'])]
    public function recoveryConfirm(
        ConfirmAccountRecoveryAction $action,
        Request $request,
    ): Response {
        try {
            $action($request);

            return $this->redirect($this->frontendBaseUrl . '?restore-account-status=ok');
        } catch (\InvalidArgumentException $e) {
            return $this->redirect($this->frontendBaseUrl . '?restore-account-status=invalid');
        }
    }
}
