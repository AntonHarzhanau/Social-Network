<?php

namespace App\Modules\Feed\Domain\Entity;

use App\Modules\Comment\Domain\Entity\CommentThread;
use App\Modules\Feed\Domain\Enum\PostKindEnum;
use App\Modules\Feed\Domain\Enum\PostStatusEnum;
use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use App\Modules\User\Domain\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'posts')]
#[ORM\Index(columns: ['wall_id', 'created_at'], name: 'idx_posts_wall_created_at')]
#[ORM\Index(columns: ['created_at'], name: 'idx_posts_created_at')]
#[ORM\Index(columns: ['status', 'wall_id', 'created_at'], name: 'idx_posts_status_wall_created_at')]
#[ORM\HasLifecycleCallbacks]
class Post
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(targetEntity: Wall::class, inversedBy: 'posts')]
    #[ORM\JoinColumn(name: 'wall_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Wall $wall = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'author_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $author = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column(enumType: VisibilityEnum::class, length: 20)]
    private VisibilityEnum $visibility = VisibilityEnum::PUBLIC;

    #[ORM\Column(enumType: PostStatusEnum::class, length: 20)]
    private PostStatusEnum $status = PostStatusEnum::PUBLISHED;

    #[ORM\Column(enumType: PostKindEnum::class, length: 20)]
    private PostKindEnum $kind = PostKindEnum::ORIGINAL;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: 'original_post_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Post $originalPost = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $quote = null;

    #[ORM\OneToOne(targetEntity: CommentThread::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(name: 'comment_thread_id', referencedColumnName: 'id', nullable: false)]
    private ?CommentThread $commentThread = null;

    #[ORM\Column(options: ['default' => 0])]
    private int $likeCount = 0;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->commentThread ??= new CommentThread();
        $this->createdAt ??= new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getVisibility(): ?VisibilityEnum
    {
        return $this->visibility;
    }

    public function setVisibility(VisibilityEnum $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getStatus(): ?PostStatusEnum
    {
        return $this->status;
    }

    public function setStatus(PostStatusEnum $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getKind(): ?PostKindEnum
    {
        return $this->kind;
    }

    public function setKind(PostKindEnum $kind): static
    {
        $this->kind = $kind;

        return $this;
    }

    public function getQuote(): ?string
    {
        return $this->quote;
    }

    public function setQuote(?string $quote): static
    {
        $this->quote = $quote;

        return $this;
    }

    public function getLikeCount(): ?int
    {
        return $this->likeCount;
    }

    public function setLikeCount(int $likeCount): static
    {
        $this->likeCount = $likeCount;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getWall(): ?Wall
    {
        return $this->wall;
    }

    public function setWall(?Wall $wall): static
    {
        $this->wall = $wall;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getOriginalPost(): ?self
    {
        return $this->originalPost;
    }

    public function setOriginalPost(?self $originalPost): static
    {
        $this->originalPost = $originalPost;

        return $this;
    }

    public function getCommentThread(): ?CommentThread
    {
        return $this->commentThread;
    }

    public function setCommentThread(CommentThread $commentThread): static
    {
        $this->commentThread = $commentThread;

        return $this;
    }

}
