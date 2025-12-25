<?php

namespace App\Modules\Chat\Domain\Entity;

use App\Modules\Shared\Domain\Enum\ChatParticipantRoleEnum;
use App\Modules\User\Domain\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
class ChatParticipant
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'chatParticipants')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Chat $chat = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\Column(length: 255, enumType: ChatParticipantRoleEnum::class)]
    private ?ChatParticipantRoleEnum $role = null;

    #[ORM\Column]
    private ?bool $isMuted = false;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastReadAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $joinedAt = null;

    #[ORM\ManyToOne(targetEntity: Message::class)]
    #[ORM\JoinColumn(name: 'last_read_message_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Message $lastReadMessage = null;

    public function __construct()
    {
        $this->joinedAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getChat(): ?Chat
    {
        return $this->chat;
    }

    public function setChat(?Chat $chat): static
    {
        $this->chat = $chat;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getRole(): ?ChatParticipantRoleEnum
    {
        return $this->role;
    }

    public function setRole(ChatParticipantRoleEnum $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function isMuted(): ?bool
    {
        return $this->isMuted;
    }

    public function setIsMuted(bool $isMuted): static
    {
        $this->isMuted = $isMuted;

        return $this;
    }

    public function getLastReadAt(): ?\DateTimeImmutable
    {
        return $this->lastReadAt;
    }

    public function setLastReadAt(?\DateTimeImmutable $lastReadAt): static
    {
        $this->lastReadAt = $lastReadAt;

        return $this;
    }

    public function getJoinedAt(): ?\DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTimeImmutable $joinedAt): static
    {
        $this->joinedAt = $joinedAt;

        return $this;
    }

    public function getLastReadMessage(): ?Message
    {
        return $this->lastReadMessage;
    }

    public function setLastReadMessage(?Message $lastReadMessage): static
    {
        $this->lastReadMessage = $lastReadMessage;

        return $this;
    }
}
