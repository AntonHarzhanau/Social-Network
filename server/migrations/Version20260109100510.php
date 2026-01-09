<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260109100510 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_asset ADD width INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_asset ADD height INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_asset ADD duration_seconds DOUBLE PRECISION DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media_asset DROP width');
        $this->addSql('ALTER TABLE media_asset DROP height');
        $this->addSql('ALTER TABLE media_asset DROP duration_seconds');
    }
}
