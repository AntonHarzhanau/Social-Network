<?php

namespace App\Modules\Notification\Domain\Entity;

use App\Modules\Notification\Domain\Enum\NotificationTypeEnum;
use App\Modules\User\Domain\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'notification')]
#[ORM\Index(columns: ['recipient_id', 'created_at'], name: 'idx_notif_recipient_created')]
#[ORM\Index(columns: ['recipient_id', 'type', 'group_key'], name: 'idx_notif_grouping')]
#[ORM\UniqueConstraint(columns: ['recipient_id', 'type', 'group_key'], name: 'uniq_notif_group')]
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

    #[ORM\Column(length: 64, enumType: NotificationTypeEnum::class)]
    private NotificationTypeEnum $type;

    #[ORM\Column(type: Types::TEXT)]
    private string $text;

    #[ORM\Column(type: Types::JSONB)]
    private array $payload = [];

    #[ORM\Column(name: 'group_key', length: 120, nullable: true)]
    private ?string $groupKey = null;

    #[ORM\Column(name: 'group_count', options: ['default' => 1])]
    private int $groupCount = 1;

    #[ORM\Column(name: 'created_at')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(name: 'last_event_at', nullable: true)]
    private ?\DateTimeImmutable $lastEventAt = null;

    public function __construct(
        User $recipient,
        NotificationTypeEnum $type,
        string $text,
        array $payload = [],
        ?string $groupKey = null,
    ) {
        $this->recipient = $recipient;
        $this->type = $type;
        $this->text = $text;
        $this->payload = $payload;
        $this->groupKey = $groupKey;

        $now = new \DateTimeImmutable();
        $this->createdAt = $now;
        $this->lastEventAt = $now;
    }


    public function aggregate(
        string $newText,
        array $mergePayload = [],
        ?\DateTimeImmutable $at = null,
    ): void {
        $this->groupCount++;
        $this->text = $newText;
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

    public function getType(): NotificationTypeEnum
    {
        return $this->type;
    }

    public function getText(): string
    {
        return $this->text;
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

    public function getSource(): ?array
    {
        return $this->payload['source'] ?? null;
    }

}
