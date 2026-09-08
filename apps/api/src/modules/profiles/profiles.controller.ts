import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('me')
  @ApiBearerAuth()
  createMyProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProfileDto) {
    return this.profilesService.createForUser(user.id, dto);
  }

  @Patch('me')
  @ApiBearerAuth()
  updateMyProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.profilesService.updateForUser(user.id, dto);
  }

  @Get('me')
  @ApiBearerAuth()
  getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profilesService.findByUserId(user.id);
  }

  // Los perfiles son públicos por defecto — se consulta sin autenticación.
  @Public()
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.profilesService.findByUsername(username);
  }
}
