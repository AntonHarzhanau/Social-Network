<?php

namespace Tests\Modules\Identity\Integration\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class AuthControllerTest extends WebTestCase
{
    public function testRegisterReturns201(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/auth/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'newuser@example.com',
            'firstName' => 'Anton',
            'lastName' => 'Test',
            'password' => 'password123',
            'dateOfBirth' => '2000-01-01',
        ]));

        $this->assertResponseStatusCodeSame(201);

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($data['ok']);
        $this->assertMatchesRegularExpression('/^[a-f0-9]{64}$/', $data['verificationToken']);
    }

    public function testRegisterValidation422(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/auth/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'firstName' => 'Anton',
            'lastName' => 'Test',
            'password' => 'password123',
            'dateOfBirth' => '2000-01-01',
        ]));

        $this->assertResponseStatusCodeSame(422);
    }
}
