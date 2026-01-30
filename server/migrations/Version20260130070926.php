<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260130070926 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE education DROP CONSTRAINT fk_db0a5ed29d86650f');
        $this->addSql('DROP INDEX idx_db0a5ed29d86650f');
        $this->addSql('ALTER TABLE education RENAME COLUMN user_id_id TO user_id');
        $this->addSql('ALTER TABLE education ADD CONSTRAINT FK_DB0A5ED2A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_DB0A5ED2A76ED395 ON education (user_id)');
        $this->addSql('ALTER TABLE work_experience DROP CONSTRAINT fk_1ef36cd09d86650f');
        $this->addSql('DROP INDEX idx_1ef36cd09d86650f');
        $this->addSql('ALTER TABLE work_experience RENAME COLUMN user_id_id TO user_id');
        $this->addSql('ALTER TABLE work_experience ADD CONSTRAINT FK_1EF36CD0A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_1EF36CD0A76ED395 ON work_experience (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE education DROP CONSTRAINT FK_DB0A5ED2A76ED395');
        $this->addSql('DROP INDEX IDX_DB0A5ED2A76ED395');
        $this->addSql('ALTER TABLE education RENAME COLUMN user_id TO user_id_id');
        $this->addSql('ALTER TABLE education ADD CONSTRAINT fk_db0a5ed29d86650f FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_db0a5ed29d86650f ON education (user_id_id)');
        $this->addSql('ALTER TABLE work_experience DROP CONSTRAINT FK_1EF36CD0A76ED395');
        $this->addSql('DROP INDEX IDX_1EF36CD0A76ED395');
        $this->addSql('ALTER TABLE work_experience RENAME COLUMN user_id TO user_id_id');
        $this->addSql('ALTER TABLE work_experience ADD CONSTRAINT fk_1ef36cd09d86650f FOREIGN KEY (user_id_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_1ef36cd09d86650f ON work_experience (user_id_id)');
    }
}
