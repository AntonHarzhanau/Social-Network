<?php

namespace App\Modules\User\Application\Action\Auth;

use App\Modules\Shared\Application\Message\SendEmailMessage;
use App\Modules\Shared\Application\Port\EmailSenderInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Application\Service\RandomPasswordGenerator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class ResetPasswordToRandomAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly RandomPasswordGenerator $passwordGenerator,
        private readonly EmailSenderInterface $mailer,
    ) {}

    public function execute(string $email): void
    {
        $user = $this->users->findByEmail($email);

        if (!$user || $user->getDeletedAt() !== null) {
            return;
        }

        $plain = $this->passwordGenerator->generate(16);

        $user->setPassword($this->passwordHasher->hashPassword($user, $plain));
        $this->users->save($user, true);

        $body = \sprintf(
            '<p>You requested a password reset.</p>
             <p>Your new temporary password is:</p>
             <p><b>%s</b></p>
             <p>Please log in and change it immediately.</p>',
            htmlspecialchars($plain, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
        );

       $this->mailer->send(new SendEmailMessage(
            to: [$user->getEmail()],
            from: 'no-reply@socialnetwork.com',
            subject: 'Your password has been reset',
            body: $body,
        ));
    }
}
