<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251204204812 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE direct_chat_index (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, user1_id UUID NOT NULL, user2_id UUID NOT NULL, chat_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_962B4F4956AE248B ON direct_chat_index (user1_id)');
        $this->addSql('CREATE INDEX IDX_962B4F49441B8B65 ON direct_chat_index (user2_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_direct_chat_chat ON direct_chat_index (chat_id)');
        $this->addSql('ALTER TABLE direct_chat_index ADD CONSTRAINT FK_962B4F4956AE248B FOREIGN KEY (user1_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE direct_chat_index ADD CONSTRAINT FK_962B4F49441B8B65 FOREIGN KEY (user2_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE direct_chat_index ADD CONSTRAINT FK_962B4F491A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE direct_chat_index DROP CONSTRAINT FK_962B4F4956AE248B');
        $this->addSql('ALTER TABLE direct_chat_index DROP CONSTRAINT FK_962B4F49441B8B65');
        $this->addSql('ALTER TABLE direct_chat_index DROP CONSTRAINT FK_962B4F491A9A7125');
        $this->addSql('DROP TABLE direct_chat_index');
    }
}
