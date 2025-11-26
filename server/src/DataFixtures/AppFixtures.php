<?php

namespace App\DataFixtures;

use App\Entity\Post;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
    )
    {}

    public function load(ObjectManager $manager): void
    {
        $conn = $manager->getConnection();
        $conn->executeStatement('TRUNCATE TABLE post, "user" CASCADE');

        // $product = new Product();
        // $manager->persist($product);
        $user = $this->createUser();
        $manager->persist($user);

        for ($i=0; $i < 5; $i++) { 
            $post = $this->createPost();
            $user->addPost($post);
            $manager->persist($post);
        }

        $manager->flush();
    }

    public function createUser(): User
    {
        $user = new User();
        $user->setEmail('user@mail.com');
        $user->setUsername('user');
        $user->setPassword($this->passwordHasher->hashPassword($user, '1234'));
        $user->setDateOfBirth(new \DateTimeImmutable('2000-01-01'));

        return $user;
    }

    public function createPost(): Post
    {
        $post = new Post();
        $post->setContent('This is a sample post content.');

        return $post;
    }
}
