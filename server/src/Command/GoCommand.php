<?php

namespace App\Command;

use App\Modules\SocialGraph\Api\SocialGraphApiInterface;
use App\Modules\User\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;


#[AsCommand(
    name: 'Go',
    description: 'Add a short description for your command',
)]
class GoCommand extends Command
{
    public function __construct(
        private readonly SocialGraphApiInterface $socialGraphApi,
        private readonly UserRepositoryInterface $userRepository,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $user = $this->userRepository->findByEmail('user1@mail.com');
        $blockedUserIds = $this->socialGraphApi->getBlockedUsersIdsForUser($user->getId());
        // dd($blockedUserIds);
        dd($blockedUserIds[0]['id']->toRfc4122());
        $ids = array_map(fn($id) => $id['blockedId'], $blockedUserIds);
        dd($ids);
        return Command::SUCCESS;
    }
}
