<?php

namespace App\DataFixtures;

use App\Modules\Comment\Domain\Entity\Comment;
use App\Modules\Feed\Domain\Entity\Post;
use App\Modules\User\Domain\Entity\User;
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

        $anton = (new User())
            ->setEmail('anton.harzhanau@gmail.com');
        $anton->setUsername('Anton Harzhanau');
        $anton->setPassword($this->passwordHasher->hashPassword($anton, '1234'));
        $anton->setDateOfBirth(\DateTimeImmutable::createFromMutable(
            new \DateTime('-29 years')
        ));
        $manager->persist($anton);

        for ($i=0; $i < 30; $i++) { 
            $user = $this->createUser($i);
            $manager->persist($user);
        }

        $manager->flush();
    }

    public function createUser(int $i): User
    {
        $faker = \Faker\Factory::create();
        $user = new User();
        $user->setEmail("user{$i}@mail.com");
        $user->setUsername("User{$i}" . " " . $faker->lastName());
        $user->setPassword($this->passwordHasher->hashPassword($user, '1234'));
        $user->setDateOfBirth(\DateTimeImmutable::createFromMutable(
            $faker->dateTimeBetween('-30 years', '-18 years')
        ));
        $user->setEmailVerifiedAt(new \DateTimeImmutable());

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
