<?php

namespace App\Modules\Feed\Domain\Entity;

use App\Modules\Comment\Domain\Entity\CommentThread;
use App\Modules\User\Domain\Entity\User;
use App\Modules\Feed\Domain\Enum\VisibilityEnum;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Post
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column]
    private ?int $likeCount = 0;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(enumType: VisibilityEnum::class)]
    private ?VisibilityEnum $visibility = VisibilityEnum::PUBLIC;


    #[ORM\OneToOne(targetEntity: CommentThread::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\JoinColumn(name: 'comment_thread_id', referencedColumnName: 'id', nullable: false)]
    private ?CommentThread $commentThread  = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'post_likes')]
    #[ORM\JoinColumn(name: 'post_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\InverseJoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private Collection $likeBy;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    /**
     * @var Collection<int, PostMediaBinding>
     */
    #[ORM\OneToMany(
        targetEntity: PostMediaBinding::class,
        cascade: ['persist'],
        mappedBy: 'post',
        orphanRemoval: true
    )]
    private Collection $bindedMedia;

    public function __construct()
    {
        $this->commentThread = new CommentThread();
        $this->likeBy = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->bindedMedia = new ArrayCollection();
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

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getVisibility(): ?VisibilityEnum
    {
        return $this->visibility;
    }

    public function setVisibility(?VisibilityEnum $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getCommentThread(): CommentThread
    {
        return $this->commentThread;
    }


    /**
     * @return Collection<int, User>
     */
    public function getLikeBy(): Collection
    {
        return $this->likeBy;
    }

    public function addLikeBy(User $likeBy): static
    {
        if (!$this->likeBy->contains($likeBy)) {
            $this->likeBy->add($likeBy);
        }

        return $this;
    }

    public function removeLikeBy(User $likeBy): static
    {
        $this->likeBy->removeElement($likeBy);

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


    /**
     * @return Collection<int, PostMediaBinding>
     */
    public function getBindedMedia(): Collection
    {
        return $this->bindedMedia;
    }

    public function addBindedMedia(PostMediaBinding $bindedMedia): static
    {
        if (!$this->bindedMedia->contains($bindedMedia)) {
            $this->bindedMedia->add($bindedMedia);
            $bindedMedia->setPost($this);
        }

        return $this;
    }

    public function removeBindedMedia(PostMediaBinding $bindedMedia): static
    {
        if ($this->bindedMedia->removeElement($bindedMedia)) {
            // set the owning side to null (unless already changed)
            if ($bindedMedia->getPost() === $this) {
                $bindedMedia->setPost(null);
            }
        }

        return $this;
    }
}
