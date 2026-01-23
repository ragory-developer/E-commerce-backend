/**
 * REFRESH TOKEN DTO
 *
 * Used when requesting new access token.
 */

import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
