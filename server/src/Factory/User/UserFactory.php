<?php

namespace App\Factory\User;

use App\DTO\Common\AuthorSummaryDTO;
use App\Entity\User;

final readonly class UserFactory
{
   public function toAuthorSummaryDTO(User $user): AuthorSummaryDTO
   {
       return new AuthorSummaryDTO(
           id: $user->getId(),
           username: $user->getUsername(),
           avatarUrl: $user->getAvatarUrl()
       );
   } 
}
