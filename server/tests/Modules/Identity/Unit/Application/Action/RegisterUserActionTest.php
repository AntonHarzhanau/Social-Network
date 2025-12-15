<?php

namespace Tests\Modules\Identity\Unit\Application\Action;

use App\Modules\Identity\Application\Action\RegisterUserAction;
use App\Modules\Identity\Domain\Entity\EmailVerification;
use App\Modules\Identity\Domain\Entity\User;
use App\Modules\Identity\Domain\Exception\EmailAlreadyInUseException;
use App\Modules\Identity\Domain\Repository\EmailVerificationRepositoryInterface;
use App\Modules\Identity\Domain\Repository\UserRepositoryInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class RegisterUserActionTest extends TestCase
{
    public function testThrowsWhenEmailAlreadyUsed(): void
    {
        $users = $this->createMock(UserRepositoryInterface::class);
        $emailVerifs = $this->createMock(EmailVerificationRepositoryInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);

        $users->method('findByEmail')->willReturn(new User());

        $action = new RegisterUserAction($users, $emailVerifs, $hasher);

        $this->expectException(EmailAlreadyInUseException::class);

        $action(
            'test@example.com',
            'Anton',
            'Test',
            'password',
            '2000-01-01'
        );
    }

    public function testRegistersUserAndCreatesEmailVerification(): void
    {
        $users = $this->createMock(UserRepositoryInterface::class);
        $emailVerifs = $this->createMock(EmailVerificationRepositoryInterface::class);
        $hasher = $this->createMock(UserPasswordHasherInterface::class);

        $users->method('findByEmail')->willReturn(null);

        $hasher->method('hashPassword')->willReturn('hashed_password');

        /** @var User $savedUser */
        $savedUser = null;
        $users->expects($this->once())
            ->method('save')
            ->willReturnCallback(function (User $u) use (&$savedUser) {
                $savedUser = $u;
            });

        /** @var EmailVerification $savedEv */
        $savedEv = null;
        $emailVerifs->expects($this->once())
            ->method('save')
            ->willReturnCallback(function (EmailVerification $ev) use (&$savedEv) {  //
                $savedEv = $ev;
            });

        $action = new RegisterUserAction($users, $emailVerifs, $hasher);

        $rawToken = $action(
            'Test@Example.com',
            'Anton',
            'Test',
            'password',
            '2000-01-01',
            '127.0.0.1',
            'UnitTest UA'
        );

        // token: bin2hex(random_bytes(32)) => 64 hex chars
        $this->assertMatchesRegularExpression('/^[a-f0-9]{64}$/', $rawToken);

        // User saved
        $this->assertInstanceOf(User::class, $savedUser);
        $this->assertSame('test@example.com', $savedUser->getEmail());
        $this->assertSame('Anton Test', $savedUser->getUsername());
        $this->assertSame('hashed_password', $savedUser->getPassword());

        // Email verification saved
        $this->assertInstanceOf(EmailVerification::class, $savedEv);
        $this->assertSame(hash('sha256', $rawToken), $savedEv->getTokenHash());
        $this->assertSame('127.0.0.1', $savedEv->getIp());
        $this->assertSame('UnitTest UA', $savedEv->getUserAgent());
    }
}
