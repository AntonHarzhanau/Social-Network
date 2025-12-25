<?php

namespace App\Modules\User\Application\Action;

use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Event\UserRegistredEvent;
use App\Modules\User\Domain\Exception\EmailAlreadyInUseException;
use App\Modules\User\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Domain\Service\PasswordHasher;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ResendEmailVerificationAction
{
    public function __construct(
        private EmailVerificationRepositoryInterface $emailVerificationRepository,
        private UserRepositoryInterface $userRepository,
    ) {}

    public function __invoke(
        string $email,
        ?string $ip,
        ?string $userAgent,

    ): UserRegistredEvent {

        $user = $this->userRepository->findByEmail($email);
        if ($user === null) {
            throw new NotFoundHttpException('User not found.');
        }

        $verification = $this->emailVerificationRepository->getEmailVerificationByEmail($email);
        if ($verification !== null) {
            if ($verification->getConsumedAt() !== null) {
                throw new NotFoundHttpException('Email verification not found.');
            }
             $this->emailVerificationRepository->deletePendingForUser($user);
        }


       

        return new UserRegistredEvent($user, $ip, $userAgent);
    }
}
