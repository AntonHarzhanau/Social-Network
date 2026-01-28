<?php

namespace App\Modules\Chat\Domain\Repository;

use App\Modules\Chat\Domain\Entity\ChatParticipant;
use Symfony\Component\Uid\Uuid;

interface ChatParticipantRepositoryInterface
{
    public function save(ChatParticipant $chatParticipant): void;
    public function findBy(array $criteria, array|null $orderBy = null, int|null $limit = null, int|null $offset = null): array;
    public function findOneBy(array $criteria, array|null $orderBy = null): ?ChatParticipant;
    public function findAllUsersIdByChatId(
        Uuid $chatId,
        ?int $page = null,
        ?int $limit = null,
        ?bool $includeDeleted = false,
        ?string $search = null
    ): array;

    public function delete(ChatParticipant $chatParticipant): void;

}
