<?php

namespace App\Modules\Shared\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
final class HealthCheckController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function register(): JsonResponse
    {

        return $this->json(['ok' => true], 200);
    }
}
