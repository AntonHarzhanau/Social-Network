<?php

namespace App\Modules\Chat\Application\Action\Message;

use App\Modules\Chat\Application\Command\NewMessage;
use App\Modules\Chat\Application\Port\UserDirectoryInterface;
use App\Modules\Chat\Application\Service\DirectChatService;
use App\Modules\Chat\Application\Service\MessageService;
use App\Modules\Chat\Domain\Entity\Message;
use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use Symfony\Component\Uid\Uuid;

final class SendMessageToUserAction
{
    public function __construct(
        private readonly UserDirectoryInterface $userDirectory,
        private readonly DirectChatService $directChatService,
        private readonly MessageService $messageService,
        private readonly SocialGraphApiInterface $socialGraphApi,
    ) {}

    public function __invoke(Uuid $currentUserId, Uuid $addresseeId, NewMessage $dto): Message
    {
        $currentUser = $this->userDirectory->findById($currentUserId);
        $addressee = $this->userDirectory->findById($addresseeId);
        if (!$currentUser || !$addressee) {
            throw new \InvalidArgumentException('User not found.');
        }

        if ($this->socialGraphApi->isUserBlockedByUser($addresseeId, $currentUserId)) {
            throw new \RuntimeException('Cannot send message to a user who has blocked you.');
        }
        
        $chat = $this->directChatService->getOrCreateDirectChat($currentUser, $addressee);

        $message = $this->messageService->createMessage($chat->getId(), $currentUser->getId(), $dto->content);

        return $message;
    }
}
