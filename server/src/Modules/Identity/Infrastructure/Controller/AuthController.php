<?php

namespace App\Modules\Identity\Infrastructure\Controller;

use App\Modules\Identity\Application\Action\GetMeAction;
use App\Modules\Identity\Application\Action\RegisterUserAction;
use App\Modules\Identity\Application\Action\VerifyEmailAction;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Infrastructure\Http\Request\RegisterRequest;
use App\Modules\Identity\Infrastructure\Http\Request\VerifyEmailRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        #[MapRequestPayload(validationFailedStatusCode: 422)] RegisterRequest $dto,
        Request $request,
        RegisterUserAction $action,
    ): JsonResponse {
        $userIp = $request->getClientIp();
        $userAgent = $request->headers->get('User-Agent');

        $token = $action(
            $dto->email,
            $dto->firstName,
            $dto->lastName,
            $dto->password,
            $dto->dateOfBirth,
            $userIp,
            $userAgent,
        );

        return $this->json(['ok' => true, 'verificationToken' => $token], 201);
    }

    #[Route('/verify-email', methods: ['POST'])]
    public function verifyEmail(
        #[MapRequestPayload(validationFailedStatusCode: 422)] VerifyEmailRequest $dto,
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
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);
        return $this->json($action($user));
    }
}
