<?php

namespace App\Modules\Feed\Domain\Entity;

use App\Modules\Feed\Domain\Enum\WallPostKindEnum;
use App\Modules\User\Domain\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'wall_posts')]
#[ORM\Index(columns: ['wall_id', 'created_at'], name: 'idx_wall_posts_wall_created_at')]
#[ORM\Index(columns: ['created_at'], name: 'idx_wall_posts_created_at')]
class WallPost
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: Wall::class)]
    #[ORM\JoinColumn(name: 'wall_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Wall $wall;

    #[ORM\ManyToOne(targetEntity: Post::class)]
    #[ORM\JoinColumn(name: 'post_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Post $post;

    // (for RESHARE = reposter)
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'actor_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    private ?User $actor;

    #[ORM\Column(enumType: WallPostKindEnum::class, length: 20)]
    private ?WallPostKindEnum $kind = WallPostKindEnum::ORIGINAL;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt;

    // repost comment/quote
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $quote = null;

    public function __construct(Wall $wall, Post $post, ?User $actor = null, WallPostKindEnum $kind = WallPostKindEnum::ORIGINAL, ?string $quote = null)
    {
        $this->wall = $wall;
        $this->post = $post;
        $this->actor = $actor;
        $this->kind = $kind;
        $this->quote = $quote;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }
    public function getWall(): ?Wall
    {
        return $this->wall;
    }
    public function getPost(): ?Post
    {
        return $this->post;
    }
    public function getActor(): ?User
    {
        return $this->actor;
    }
    public function getKind(): ?WallPostKindEnum
    {
        return $this->kind;
    }
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }
    public function getQuote(): ?string
    {
        return $this->quote;
    }

    public function setKind(WallPostKindEnum $kind): static
    {
        $this->kind = $kind;

        return $this;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function setQuote(?string $quote): static
    {
        $this->quote = $quote;

        return $this;
    }

    public function setWall(?Wall $wall): static
    {
        $this->wall = $wall;

        return $this;
    }

    public function setPost(?Post $post): static
    {
        $this->post = $post;

        return $this;
    }

    public function setActor(?User $actor): static
    {
        $this->actor = $actor;

        return $this;
    }
}
