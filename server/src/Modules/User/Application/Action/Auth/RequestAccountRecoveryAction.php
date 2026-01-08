<?php

namespace App\Modules\User\Application\Action\Auth;

use App\Modules\Shared\Application\Message\SendEmailMessage;
use App\Modules\Shared\Application\Port\EmailSenderInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\HttpFoundation\UriSigner;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class RequestAccountRecoveryAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly UriSigner $uriSigner,
        private readonly EmailSenderInterface $emailSender,
    ) {}

    public function execute(string $email): void
    {
        $email = mb_strtolower(trim($email));
        $user = $this->userRepository->findByEmail($email);

        if ($user === null || $user->getDeletedAt() === null) {
            return;
        }

        $expiresAt = time() + 3600; // 1 hour
        $deletedTs = $user->getDeletedAt()->getTimestamp();

        $unsignedUrl = $this->urlGenerator->generate(
            'api_auth_recovery_confirm',
            [
                'id' => $user->getId()->toRfc4122(),
                'deleted' => $deletedTs,
                'expires' => $expiresAt,
            ],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $signedUrl = $this->uriSigner->sign($unsignedUrl);

        $body = sprintf(
            '<p>To restore your account, click the link (valid for 1 hour):</p><p><a href="%1$s">%1$s</a></p>',
            htmlspecialchars($signedUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
        );

        $this->emailSender->send(new SendEmailMessage(
            to: [$user->getEmail()],
            from: 'no-reply@socialnetwork.com',
            subject: 'Restore your account',
            body: $body,
        ));
    }
}
