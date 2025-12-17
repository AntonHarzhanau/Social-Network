<?php

namespace App\Modules\User\Infrastructure\EventSubscriber;

use App\Modules\User\Domain\Entity\EmailVerification;
use App\Modules\User\Domain\Entity\User;
use App\Modules\User\Domain\Event\UserRegistredEvent;
use App\Modules\User\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use App\Modules\User\Domain\Service\EmailVerificationTokenGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class OnUserRegisteredSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EmailVerificationRepositoryInterface $emailVerificationRepository,
        private UserRepositoryInterface $userRepository,
        private EmailVerificationTokenGenerator $tokenGenerator,
        private UrlGeneratorInterface $urlGenerator,
        private MailerInterface $mailer,
        private string $frontendBaseUrl = 'http://localhost:3000',
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
        // dd($event->getUser());
        $now = new \DateTimeImmutable();
        $expiresAt = $now->add(new \DateInterval('PT24H'));
    
        $emailVerification = new EmailVerification();
        $emailVerification->setUser($event->getUser());
        $emailVerification->setTokenHash($tokenHash);
        $emailVerification->setSentEmail($event->getUser()->getEmail());
        // $emailVerification->setIp($event->getIp());
        // $emailVerification->setUserAgent($event->getUserAgent());
        $emailVerification->setExpiresAt($expiresAt);

        // (опционально) инвалидировать предыдущие токены пользователя
        // $this->emailVerificationRepository->invalidateActiveForUser($event->userId);

        $this->emailVerificationRepository->save($emailVerification, true);

        $verifyLink = rtrim($this->frontendBaseUrl, '/') . '/verify-email?token=' . urlencode($rawToken);

        // Вариант 2: ссылка на бэкенд GET-роут (см. раздел 3 ниже)
        // $verifyLink = $this->urlGenerator->generate('api_auth_verify_email_get', ['token' => $rawToken], UrlGeneratorInterface::ABSOLUTE_URL);

        $email = (new  Email())
            ->from('Social.Network@example.com')
            ->to($event->getUser()->getEmail())
            ->subject('Please verify your email address')
            ->html(sprintf(
                '<p>Welcome to Social Network!</p><p>Please verify your email address by clicking the link below:</p><p><a href="%s">%s</a></p>',
                htmlspecialchars($verifyLink, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
                htmlspecialchars($verifyLink, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
            ));

        $this->mailer->send($email);
    }
}
