<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\User\Application\Action\Auth\ConfirmAccountRecoveryAction;
use App\Modules\User\Application\Action\Auth\RegisterUserAction;
use App\Modules\User\Application\Action\Auth\RequestAccountRecoveryAction;
use App\Modules\User\Application\Action\Auth\ResendEmailVerificationAction;
use App\Modules\User\Application\Action\Auth\VerifyEmailAction;
use App\Modules\User\Infrastructure\Http\Request\RecoveryAccountRequest;
use App\Modules\User\Infrastructure\Http\Request\RegisterRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
final class AuthController extends AbstractController
{
    public function __construct(
        private readonly string $frontendBaseUrl = 'http://localhost:8098/auth'
    ) {
    }

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
            $event = $action->execute(
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

    #[Route('/verify-email', name: 'api_auth_email_verify', methods: ['GET'])]
    public function verifyEmail(
        VerifyEmailAction $action,
        Request $request,
    ): Response {
        try {
            $action->execute($request->query->get('token'));
            return $this->redirect($this->frontendBaseUrl . '?email-verify-status=ok');
        } catch (\Throwable $th) {
            return $this->redirect($this->frontendBaseUrl . '?email-verify-status=invalid');
        }
    }

    #[Route('/resend-email-verification', name: 'api_auth_resend_email_verification', methods: ['POST'])]
    public function resendVerifyEmail(
        Request $request,
        ResendEmailVerificationAction $action,
        EventDispatcherInterface $eventDispatcher,
    ): JsonResponse {
        $email = json_decode($request->getContent(), true)['email'] ?? null;
        $userIp = $request->getClientIp();
        $userAgent = $request->headers->get('User-Agent');
        $event = $action->execute($email, $userIp, $userAgent);

        $eventDispatcher->dispatch($event);

        return $this->json(['ok' => true]);
    }

    #[Route('/recovery/request', methods: ['POST'])]
    public function recoveryRequest(
        #[MapRequestPayload(validationFailedStatusCode: JsonResponse::HTTP_UNPROCESSABLE_ENTITY)] RecoveryAccountRequest $dto,
        RequestAccountRecoveryAction $action,
    ): JsonResponse {
        $action->execute($dto->email);
        return $this->json([
            'message' => 'A recovery request has been sent to the specified address. Check your email.'
        ], JsonResponse::HTTP_ACCEPTED);
    }

    #[Route('/recovery/confirm', name: 'api_auth_recovery_confirm', methods: ['GET'])]
    public function recoveryConfirm(
        ConfirmAccountRecoveryAction $action,
        Request $request,
    ): Response {
        try {
            $action->execute($request);

            return $this->redirect($this->frontendBaseUrl . '?restore-account-status=ok');
        } catch (\InvalidArgumentException $e) {
            return $this->redirect($this->frontendBaseUrl . '?restore-account-status=invalid');
        }
    }
}
