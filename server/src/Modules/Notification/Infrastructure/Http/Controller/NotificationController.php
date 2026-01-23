<?php

namespace App\Modules\Notification\Infrastructure\Http\Controller;

use App\Modules\Notification\Application\Action\GetListAction;
use App\Modules\Notification\Application\Action\GetUnreadNotificationCountAction;
use App\Modules\Notification\Application\Action\MarkAllReadAction;
use App\Modules\Notification\Application\Action\MarkReadAction;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Uid\Uuid;

#[Route('/api/notifications')]
final class NotificationController extends AbstractController
{
    #[Route('', name: 'notification_list', methods: ['GET'])]
    public function list(
        Request $request,
        #[CurrentUser()] User $currentUser,
        GetListAction $action,
    ): JsonResponse {
        $page = max((int) $request->query->get('page', 1), 1);
        $limit = min(max((int) $request->query->get('limit', 20), 1), 50);
        $notifications = $action->execute($currentUser->getId(), $page, $limit);
        return $this->json($notifications, JsonResponse::HTTP_OK);
    }

    #[Route('/unread-count', name: 'notification_unread_count', methods: ['GET'])]
    public function unreadCount(
        Request $request,
        #[CurrentUser()] User $currentUser,
        GetUnreadNotificationCountAction $action,
    ): JsonResponse {
        $unreadCount = $action->execute($currentUser->getId());

        return $this->json(['unreadCount' => $unreadCount], JsonResponse::HTTP_OK);
    }

    #[Route('/{notificationId}/read', name: 'notification_mark_read', methods: ['POST'])]
    public function markAsRead(
        string $notificationId,
        #[CurrentUser()] User $currentUser,
        MarkReadAction $action,
    ): JsonResponse {
        $action->execute(Uuid::fromString($notificationId));

        return $this->json(null, JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('/read-all', name: 'notification_mark_read_all', methods: ['POST'])]
    public function markAllAsRead(
        #[CurrentUser()] User $currentUser,
        MarkAllReadAction $action,
    ): JsonResponse {
        $action->execute($currentUser->getId());

        return $this->json(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
