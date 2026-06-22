import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'demo@manulife.com',
    })
    email: string;

    @ApiProperty({
        description: 'User role',
        example: 'USER',
        enum: ['USER', 'ADMIN'],
    })
    role: string;
}
