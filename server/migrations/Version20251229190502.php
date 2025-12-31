<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251229190502 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT fk_a36222a89d86650f');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT fk_a36222a82f68b530');
        $this->addSql('DROP INDEX idx_a36222a82f68b530');
        $this->addSql('DROP INDEX idx_a36222a89d86650f');
        $this->addSql('ALTER TABLE group_member ADD user_id UUID NOT NULL');
        $this->addSql('ALTER TABLE group_member ADD group_id UUID NOT NULL');
        $this->addSql('ALTER TABLE group_member DROP user_id_id');
        $this->addSql('ALTER TABLE group_member DROP group_id_id');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A8A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT FK_A36222A8FE54D947 FOREIGN KEY (group_id) REFERENCES "group" (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_A36222A8A76ED395 ON group_member (user_id)');
        $this->addSql('CREATE INDEX IDX_A36222A8FE54D947 ON group_member (group_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A8A76ED395');
        $this->addSql('ALTER TABLE group_member DROP CONSTRAINT FK_A36222A8FE54D947');
        $this->addSql('DROP INDEX IDX_A36222A8A76ED395');
        $this->addSql('DROP INDEX IDX_A36222A8FE54D947');
        $this->addSql('ALTER TABLE group_member ADD user_id_id UUID NOT NULL');
        $this->addSql('ALTER TABLE group_member ADD group_id_id UUID NOT NULL');
        $this->addSql('ALTER TABLE group_member DROP user_id');
        $this->addSql('ALTER TABLE group_member DROP group_id');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT fk_a36222a89d86650f FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE group_member ADD CONSTRAINT fk_a36222a82f68b530 FOREIGN KEY (group_id_id) REFERENCES "group" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_a36222a82f68b530 ON group_member (group_id_id)');
        $this->addSql('CREATE INDEX idx_a36222a89d86650f ON group_member (user_id_id)');
    }
}
