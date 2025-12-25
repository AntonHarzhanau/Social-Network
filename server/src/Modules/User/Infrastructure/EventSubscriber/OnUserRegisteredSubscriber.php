<?php

namespace App\Modules\User\Infrastructure\EventSubscriber;

use App\Modules\Shared\Application\Message\SendEmailMessage;
use App\Modules\Shared\Application\Port\EmailSenderInterface;
use App\Modules\User\Domain\Entity\EmailVerification;
use App\Modules\User\Domain\Event\UserRegistredEvent;
use App\Modules\User\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\User\Domain\Service\EmailVerificationTokenGenerator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class OnUserRegisteredSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EmailVerificationRepositoryInterface $emailVerificationRepository,
        private EmailVerificationTokenGenerator $tokenGenerator,
        private EmailSenderInterface $mailer,
        private readonly UrlGeneratorInterface $urlGenerator,
        private string $frontendBaseUrl = 'http://localhost:5173',
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            UserRegistredEvent::class => 'onUserRegistered',
        ];
    }

    public function onUserRegistered(UserRegistredEvent $event): void
    {
        ['raw' => $rawToken, 'hash' => $tokenHash] = $this->tokenGenerator->generateToken();

        $now = new \DateTimeImmutable();
        $expiresAt = $now->add(new \DateInterval('PT24H'));

        $emailVerification = new EmailVerification();
        $emailVerification->setUser($event->getUser());
        $emailVerification->setTokenHash($tokenHash);
        $emailVerification->setSentEmail($event->getUser()->getEmail());
        $emailVerification->setIp($event->getIp());
        $emailVerification->setUserAgent($event->getUserAgent());
        $emailVerification->setExpiresAt($expiresAt);

        $this->emailVerificationRepository->save($emailVerification, true);

        // $verifyLink = rtrim($this->frontendBaseUrl, '/') . '/verify-email?token=' . urlencode($rawToken);

        $verifyLink = $this->urlGenerator->generate(
            'api_auth_email_verify',
            [
                'token' => $rawToken,
            ],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $body = sprintf(
            '<p>Welcome to Social Network!</p><p>Please verify your email address by clicking the link below:</p><p><a href="%s">%s</a></p>',
            htmlspecialchars($verifyLink, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            htmlspecialchars($verifyLink, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
        );

        $this->mailer->send(new SendEmailMessage(
            from: 'no-reply@socialnetwork.com',
            to: [$event->getUser()->getEmail()],
            subject: 'Please verify your email address',
            body: $body,
        ));
    }
}
