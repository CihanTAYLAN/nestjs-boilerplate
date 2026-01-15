import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, UserProfileResponseDto } from './dto';

@ApiTags('COMMON - Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user user and returns access token',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved',
    type: ApiResponseDto.getGenericResponseType(UserProfileResponseDto),
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Not authorized as user' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiBearerAuth('JwtRefresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access token using refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: ApiResponseDto.getGenericResponseType(LoginResponseDto),
  })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.sub);
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  @ApiBearerAuth('JwtAccess')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user information',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved',
    type: ApiResponseDto.getGenericResponseType(UserProfileResponseDto),
  })
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}
