<?php

namespace App\Modules\Notification\Domain\Entity;

use App\Modules\User\Domain\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'notification')]
#[ORM\Index(columns: ['recipient_id', 'read_at', 'created_at'], name: 'idx_notif_recipient_unread')]
#[ORM\Index(columns: ['recipient_id', 'created_at'], name: 'idx_notif_recipient_created')]
#[ORM\Index(columns: ['recipient_id', 'type', 'group_key', 'read_at'], name: 'idx_notif_grouping')]
class Notification
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'recipient_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $recipient = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'actor_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $actor = null;

    #[ORM\Column(length: 64, enumType: NotificationTypeEnum::class)]
    private NotificationTypeEnum $type;

    #[ORM\Column(type: Types::TEXT)]
    private string $text;

    /**
     *   { "kind": "chat", "chatId": "...", "messageId": "..." }
     *   { "kind": "friend_requests" }
     */
    #[ORM\Column(type: Types::JSONB)]
    private array $target = [];

    /**
     * Additional data for UI/logic (chatId, requestId, postId, etc.)
     */
    #[ORM\Column(type: Types::JSONB)]
    private array $payload = [];

    /**
     * For aggregation (e.g., "chat:<chatId>").
     * If null — notifications are not aggregated.
     */
    #[ORM\Column(name: 'group_key', length: 120, nullable: true)]
    private ?string $groupKey = null;

    #[ORM\Column(name: 'group_count', options: ['default' => 1])]
    private int $groupCount = 1;

    #[ORM\Column(name: 'created_at')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(name: 'last_event_at', nullable: true)]
    private ?\DateTimeImmutable $lastEventAt = null;

    // null => непрочитано
    #[ORM\Column(name: 'read_at', nullable: true)]
    private ?\DateTimeImmutable $readAt = null;

    public function __construct(
        User $recipient,
        NotificationTypeEnum $type,
        string $text,
        array $target = [],
        array $payload = [],
        ?User $actor = null,
        ?string $groupKey = null,
    ) {
        $this->recipient = $recipient;
        $this->type = $type;
        $this->text = $text;
        $this->target = $target;
        $this->payload = $payload;
        $this->actor = $actor;
        $this->groupKey = $groupKey;

        $now = new \DateTimeImmutable();
        $this->createdAt = $now;
        $this->lastEventAt = $now;
    }

    // -------------------------
    // Domain methods
    // -------------------------

    public function markRead(?\DateTimeImmutable $at = null): void
    {
        $this->readAt = $at ?? new \DateTimeImmutable();
    }

    public function markUnread(): void
    {
        $this->readAt = null;
    }

    public function aggregate(
        string $newText,
        ?array $newTarget = null,
        array $mergePayload = [],
        ?\DateTimeImmutable $at = null,
    ): void {
        $this->groupCount++;
        $this->text = $newText;

        if ($newTarget !== null) {
            $this->target = $newTarget;
        }

        $this->payload = array_replace($this->payload, $mergePayload);
        $this->lastEventAt = $at ?? new \DateTimeImmutable();
    }


    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getRecipient(): User
    {
        return $this->recipient;
    }

    public function getActor(): ?User
    {
        return $this->actor;
    }

    public function getType(): NotificationTypeEnum
    {
        return $this->type;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getTarget(): array
    {
        return $this->target;
    }

    public function getPayload(): array
    {
        return $this->payload;
    }

    public function getGroupKey(): ?string
    {
        return $this->groupKey;
    }

    public function getGroupCount(): int
    {
        return $this->groupCount;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getLastEventAt(): ?\DateTimeImmutable
    {
        return $this->lastEventAt;
    }

    public function getReadAt(): ?\DateTimeImmutable
    {
        return $this->readAt;
    }

    public function isRead(): bool
    {
        return $this->readAt !== null;
    }
}
