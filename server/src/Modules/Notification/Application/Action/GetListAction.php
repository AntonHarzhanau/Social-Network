<?php

namespace App\Modules\Notification\Application\Action;

use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetListAction
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
    ) {
    }

    public function execute(Uuid $userId, int $page = 1, int $limit = 20): array
    {
        $rows = $this->notificationRepository->findByRecipientId($userId, $page, $limit);

        $response = [];
        foreach ($rows as $notification) {
            $response[] = [
                'id' => $notification->getId()->toRfc4122(),
                'type' => $notification->getType(),
                'text' => $notification->getText(),
                'target' => $notification->getTarget(),
                'payload' => $notification->getPayload(),
                'createdAt' => $notification->getCreatedAt()->format(DATE_ATOM),
                'readAt' => $notification->getReadAt()?->format(DATE_ATOM),
            ];
        }
        return $response;
    }
}
