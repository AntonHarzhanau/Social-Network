<?php

namespace App\Modules\Shared\Infrastructure\Http;

use App\Modules\SocialGraph\Application\Exception\CannotFriendYourselfException;
use App\Modules\SocialGraph\Application\Exception\FriendshipAlreadyExistsException;
use App\Modules\SocialGraph\Application\Exception\PendingRequestNotFoundException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;

final class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly KernelInterface $kernel,) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 0],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $error = $event->getThrowable();

        $statusCode = match (true) {
            $error instanceof CannotFriendYourselfException => JsonResponse::HTTP_BAD_REQUEST,
            $error instanceof FriendshipAlreadyExistsException => JsonResponse::HTTP_CONFLICT,
            $error instanceof PendingRequestNotFoundException => JsonResponse::HTTP_NOT_FOUND,
            default => null,
        };

        if ($statusCode !== null) {
            $event->setResponse($this->jsonError($error->getMessage(), $statusCode));
            return;
        }

        if ($error instanceof HttpExceptionInterface) {
            $event->setResponse($this->jsonError($error->getMessage(), $error->getStatusCode()));
            return;
        }

        $message = $this->kernel->isDebug() ? $error->getMessage() : 'Internal Server Error';

        $event->setResponse($this->jsonError($message, JsonResponse::HTTP_INTERNAL_SERVER_ERROR));
    }

    private function jsonError(string $message, int $statusCode): JsonResponse
    {
        return new JsonResponse(
            [
                'error' => [
                    'message' => $message,
                    'status_code' => $statusCode,
                ],
            ],
            $statusCode
        );
    }
}
