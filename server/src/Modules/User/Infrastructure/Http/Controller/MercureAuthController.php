<?php

namespace App\Modules\User\Infrastructure\Http\Controller;

use App\Modules\Shared\Infrastructure\Realtime\Topics;
use App\Modules\User\Domain\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Authorization;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class MercureAuthController extends AbstractController
{
    #[Route('api/auth/mercure', name: 'auth_mercure_cookie', methods: ['POST'])]
    public function __invoke(
        Request $request,
        #[CurrentUser()] ?User $currentUser,
        Authorization $authorization
    ): Response {

        $topic = Topics::userNotifications($currentUser->getId()->toRfc4122());

        $authorization->setCookie($request, [$topic]);

        return new Response(status: 204);
    }
}
