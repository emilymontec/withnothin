import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { CursorPaginationDto } from '../../common/pagination/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findUsers(@Query() query: CursorPaginationDto) {
    return this.adminService.findUsers(query);
  }

  @Patch('users/:id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateUser(@Param('id') id: string) {
    await this.adminService.deactivateUser(id);
  }

  @Patch('users/:id/reactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reactivateUser(@Param('id') id: string) {
    await this.adminService.reactivateUser(id);
  }

  @Get('reports')
  findReports(@Query('status') status: string | undefined, @Query() query: CursorPaginationDto) {
    return this.adminService.findReports(status, query);
  }

  @Patch('reports/:id')
  updateReportStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    return this.adminService.updateReportStatus(id, dto.status);
  }

  @Delete('posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePost(@Param('id') id: string) {
    await this.adminService.removePost(id);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComment(@Param('id') id: string) {
    await this.adminService.removeComment(id);
  }
}
