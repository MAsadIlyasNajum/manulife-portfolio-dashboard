import { ApiProperty } from '@nestjs/swagger';
import { CurrentUserDto } from './current-user.dto';

export class AuthResponseDto {
    @ApiProperty({
        description: 'JWT access token (short-lived, 15 minutes)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'JWT refresh token (long-lived, 7 days)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    refreshToken: string;

    @ApiProperty({
        description: 'Authenticated user information',
        type: CurrentUserDto,
    })
    user: CurrentUserDto;
}
