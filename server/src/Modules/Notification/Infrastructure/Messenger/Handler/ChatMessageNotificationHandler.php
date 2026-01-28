<?php

namespace App\Modules\Notification\Infrastructure\Messenger\Handler;

use App\Modules\Notification\Application\Message\ChatMessageNotification;
use App\Modules\Notification\Application\Port\ChatParticipantsDirectoryInterface;
use App\Modules\Notification\Application\Port\UserDirectioryInterface;
use App\Modules\Notification\Domain\Entity\Notification;
use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;
use App\Modules\Notification\Domain\Repository\NotificationRepositoryInterface;
use App\Modules\Shared\Application\Port\RealtimePublisherInterface;
use App\Modules\Shared\Infrastructure\Realtime\Topics;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class ChatMessageNotificationHandler
{
    public function __construct(
        private NotificationRepositoryInterface $notifications,
        private UserDirectioryInterface $users,
        private ChatParticipantsDirectoryInterface $chats,
        private RealtimePublisherInterface $realtime,
    ) {
    }

    public function __invoke(ChatMessageNotification $msg): void
    {

        $chatIdStr = $msg->chatId->toRfc4122();
        $senderIdStr = $msg->senderId->toRfc4122();

        // Берём тип/заголовок чата из snapshot (без запроса в БД)
        $chatType = $msg->chatSnapshot['type'] ?? 'direct';
        $chatTitle = $msg->chatSnapshot['title'] ?? null;

        $participantIds = $this->chats->getParticipantIds($msg->chatId);
        if (!$participantIds) {
            return;
        }

        $senderName = $msg->messagePayload['sender']['name'] ?? 'Someone';

        // Текст по твоим правилам
        $text = $chatType === 'direct'
            ? \sprintf('Пользователь %s оставил сообщение', $senderName)
            : \sprintf('В чате %s есть непрочитанные сообщения', $chatTitle ?: 'без названия');

        $messageId = (string) ($msg->messagePayload['id'] ?? '');

        // target/payload агрегируемого уведомления
        $target = [
            'kind' => 'chat',
            'chatId' => $chatIdStr,
            'messageId' => $messageId,
        ];

        $mergePayload = [
            'chatId' => $chatIdStr,
            'messageId' => $messageId,
            'senderId' => $senderIdStr,
        ];

        $groupKey = 'chat:' . $chatIdStr;

        // Актор (отправитель) — получаем один раз
        $actor = $this->users->getUser($msg->senderId);

        foreach ($participantIds as $recipientId) {
            // Обычно себе не шлём уведомления
            if ($recipientId->equals($msg->senderId)) {
                continue;
            }

            $recipient = $this->users->getUser($recipientId);
            if (!$recipient) {
                continue;
            }

            $existing = $this->notifications->findGroupedForRecipient(
                recipientId: $recipientId,
                type: NotificationTypeEnum::CHAT_MESSAGE,
                groupKey: $groupKey,
            );

            if ($existing) {
                $existing->aggregate(
                    newText: $text,
                    newTarget: $target,
                    mergePayload: $mergePayload,
                );
                $notification = $existing;
            } else {
                $notification = new Notification(
                    recipient: $recipient,
                    type: NotificationTypeEnum::CHAT_MESSAGE,
                    text: $text,
                    target: $target,
                    payload: $mergePayload,
                    actor: $actor,
                    groupKey: $groupKey,
                );
            }

            $this->notifications->save($notification);

            $unreadCount = $this->notifications->countUnread($recipientId);



            $this->realtime->publish(
                Topics::userNotifications($recipientId->toRfc4122()),
                [
                    'type' => 'notification_changed',
                    'kind' => 'chat',
                    'chatId' => $chatIdStr,
                    'notificationId' => $notification->getId()?->toRfc4122(),
                    'unreadCount' => $unreadCount,
                ],
                private: false,
            );
        }
    }
}
