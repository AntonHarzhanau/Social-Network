<?php

namespace App\Entity;

use App\Enum\VisibilityEnum;
use App\Repository\PostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: PostRepository::class)]
class Post
{
    #[Groups(['post:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[Groups(['post:read'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[Groups(['post:read'])]
    #[ORM\Column]
    private ?int $likeCount = 0;

    #[Groups(['post:read'])]
    #[ORM\Column]
    private ?int $commentCount = 0;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 255, enumType: VisibilityEnum::class)]
    private ?VisibilityEnum $visibility = VisibilityEnum::PUBLIC;

    /**
     * @var Collection<int, Comment>
     */
    #[Groups(['post:read'])]
    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'post', orphanRemoval: true)]
    private Collection $comments;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    private Collection $likeBy;

    #[ORM\ManyToOne(inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['post:read'])]
    private ?User $author = null;

    /**
     * @var Collection<int, PostMediaBindings>
     */
    #[ORM\OneToMany(targetEntity: PostMediaBindings::class, mappedBy: 'post', orphanRemoval: true)]
    private Collection $bindedMedia;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
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

    public function getCommentCount(): ?int
    {
        return $this->commentCount;
    }

    public function setCommentCount(int $commentCount): static
    {
        $this->commentCount = $commentCount;

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

    public function getVisibility(): ?VisibilityEnum
    {
        return $this->visibility;
    }

    public function setVisibility(?VisibilityEnum $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setPost($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getPost() === $this) {
                $comment->setPost(null);
            }
        }

        return $this;
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
     * @return Collection<int, PostMediaBindings>
     */
    public function getBindedMedia(): Collection
    {
        return $this->bindedMedia;
    }

    public function addBindedMedium(PostMediaBindings $bindedMedium): static
    {
        if (!$this->bindedMedia->contains($bindedMedium)) {
            $this->bindedMedia->add($bindedMedium);
            $bindedMedium->setPost($this);
        }

        return $this;
    }

    public function removeBindedMedium(PostMediaBindings $bindedMedium): static
    {
        if ($this->bindedMedia->removeElement($bindedMedium)) {
            // set the owning side to null (unless already changed)
            if ($bindedMedium->getPost() === $this) {
                $bindedMedium->setPost(null);
            }
        }

        return $this;
    }
}
