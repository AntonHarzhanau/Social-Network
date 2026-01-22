<?php

namespace App\Modules\Shared\Infrastructure\Http;

use App\Modules\User\Domain\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;


final class TouchLastActiveAtSubscriber implements EventSubscriberInterface
{
    private const TOUCH_COOLDOWN_SECONDS = 120;
    public function __construct(
        private readonly Security $security,
        private readonly EntityManagerInterface $em,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::REQUEST => ['onKernelRequest']];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return;
        }

        $now = new \DateTimeImmutable();

        $lastActivity = $user->getLastLoginAt();
        if ($lastActivity instanceof \DateTimeInterface) {
            if (($now->getTimestamp() - $lastActivity->getTimestamp()) < self::TOUCH_COOLDOWN_SECONDS) {
                return;
            }
        }

        $user->setLastLoginAt($now);
        $this->em->flush();
    }
}
