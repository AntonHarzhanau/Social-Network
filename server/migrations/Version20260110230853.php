<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110230853 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comment_thread (id UUID NOT NULL, comment_count INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT fk_9474526c4b89032c');
        $this->addSql('DROP INDEX idx_9474526c4b89032c');
        $this->addSql('ALTER TABLE comment RENAME COLUMN post_id TO thread_id');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE2904019 FOREIGN KEY (thread_id) REFERENCES comment_thread (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_9474526CE2904019 ON comment (thread_id)');
        $this->addSql('ALTER TABLE media_asset ADD comment_thread_id UUID NOT NULL');
        $this->addSql('ALTER TABLE media_asset ADD CONSTRAINT FK_1DB69EEDBEEA14F FOREIGN KEY (comment_thread_id) REFERENCES comment_thread (id) NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1DB69EEDBEEA14F ON media_asset (comment_thread_id)');
        $this->addSql('ALTER TABLE post ADD comment_thread_id UUID NOT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DBEEA14F FOREIGN KEY (comment_thread_id) REFERENCES comment_thread (id) NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5A8A6C8DBEEA14F ON post (comment_thread_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE comment_thread');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CE2904019');
        $this->addSql('DROP INDEX IDX_9474526CE2904019');
        $this->addSql('ALTER TABLE comment RENAME COLUMN thread_id TO post_id');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT fk_9474526c4b89032c FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_9474526c4b89032c ON comment (post_id)');
        $this->addSql('ALTER TABLE media_asset DROP CONSTRAINT FK_1DB69EEDBEEA14F');
        $this->addSql('DROP INDEX UNIQ_1DB69EEDBEEA14F');
        $this->addSql('ALTER TABLE media_asset DROP comment_thread_id');
        $this->addSql('ALTER TABLE post DROP CONSTRAINT FK_5A8A6C8DBEEA14F');
        $this->addSql('DROP INDEX UNIQ_5A8A6C8DBEEA14F');
        $this->addSql('ALTER TABLE post DROP comment_thread_id');
    }
}
