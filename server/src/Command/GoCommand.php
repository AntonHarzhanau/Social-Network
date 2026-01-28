<?php

namespace App\Command;

use App\Modules\Notification\Infrastructure\Adapter\ChatDirectoryAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Uid\Uuid;

#[AsCommand(
    name: 'GoCommand',
    description: 'Add a short description for your command',
)]
class GoCommand extends Command
{
    public function __construct(
        private readonly ChatDirectoryAdapter $chatDirectoryAdapter
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
        $members = $this->chatDirectoryAdapter->getParticipantIds(Uuid::fromString("019c0058-23eb-7f3d-81cb-cbfa148d1a01"));
        dd($members);

        return Command::SUCCESS;
    }
}
