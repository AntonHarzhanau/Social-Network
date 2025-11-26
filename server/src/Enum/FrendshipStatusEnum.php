<?php

namespace App\Enum;

enum FrendshipStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case DECLINED = 'declined';
    case CANCELED = 'canceled';
}
