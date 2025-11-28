<?php

namespace App\DataFixtures;

use App\Entity\Comment;
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


        for ($i=0; $i < 5; $i++) { 
            $user = $this->createUser();
            for ($j=0; $j < 10; $j++) { 
                $post = $this->createPost();
                $user->addPost($post);
                $manager->persist($post);
                
                for ($k=0; $k < 3; $k++) { 
                    $comment = $this->createComment();
                    $post->addComment($comment);
                    $comment->setAuthor($user);
                    $manager->persist($comment);
                }
            }
            $manager->persist($user);
        }

        $manager->flush();
    }

    public function createUser(): User
    {
        $faker = \Faker\Factory::create();
        $user = new User();
        $user->setEmail($faker->unique()->safeEmail());
        $user->setUsername($faker->userName());
        $user->setPassword($this->passwordHasher->hashPassword($user, '1234'));
        $user->setDateOfBirth(\DateTimeImmutable::createFromMutable(
            $faker->dateTimeBetween('-30 years', '-18 years')
        ));

        return $user;
    }

    public function createPost(): Post
    {
        $faker = \Faker\Factory::create();
        $post = new Post();
        $post->setContent($faker->text(maxNbChars: 1000));

        return $post;
    }

    public function createComment(): Comment
    {
        $faker = \Faker\Factory::create();
        $comment = new Comment();
        $comment->setContent($faker->text(maxNbChars: 500));

        return $comment;
    }
}
