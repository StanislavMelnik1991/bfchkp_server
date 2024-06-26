import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Admin } from 'typeorm';
import { CreateTeamDto } from 'src/types/dto/team.dto';
import { CreateCoachDto } from 'src/types/dto/coach.dto';
import { AdminsAccessService } from './adminAccess.service';
import { AdminRoleGuard } from 'src/guards/admin.guard';
import { CreateAdminDto } from 'src/types/dto/admin.dto';
import { GetAllUsersDto } from 'src/types/dto/user.dto';
import { CreateNewsDto } from 'src/types/dto/news.dto';
import { TokenPayload } from 'src/types/token/token.types';
import { UpdateDictionaryDto } from 'src/types/dto/dictionary.dto';
import { fileSchema } from 'src/types/file'
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from 'src/constants';

@ApiTags('Команды администратора')
@ApiBearerAuth()
@UseGuards(AdminRoleGuard)
@Controller('api/admin')
export class AdminsAccessController {

  constructor(private adminsService: AdminsAccessService) { }

  @ApiOperation({ summary: 'Создание админа' })
  @ApiResponse({ status: 200, type: Admin })
  @Post('/')
  createAdmin(@Body() data: CreateAdminDto) {
    return this.adminsService.createAdmin(data);
  }

  @ApiOperation({ summary: 'Создание тренера' })
  @ApiResponse({ status: 200, type: Admin })
  @Post('/coach')
  createCoach(@Body() data: CreateCoachDto) {
    return this.adminsService.createCoach(data);
  }

  @ApiOperation({ summary: 'Создание команды' })
  @ApiResponse({ status: 200, type: Admin })
  @Post('/team')
  createTeam(@Body() data: CreateTeamDto) {
    return this.adminsService.createTeam(data);
  }

  @ApiOperation({ summary: 'Creation news image' })
  @ApiResponse({ status: 200 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Post('/news/:id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: { buffer: Buffer },
    @Req() { user }: { user: TokenPayload },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminsService.createNewsImage({ data: file.buffer, user, id });
  }

  @ApiOperation({ summary: 'Создание news' })
  @ApiResponse({ status: 200, type: Admin })
  @Post('/news')
  createNews(@Body() data: CreateNewsDto) {
    return this.adminsService.createNews(data);
  }

  @ApiOperation({ summary: 'Update dictionary' })
  @ApiResponse({ status: 200, type: Admin })
  @Patch('/dictionary/:id')
  updateDictionary(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateDictionaryDto) {
    return this.adminsService.updateDictionary({ ...data, id });
  }

  @ApiOperation({ summary: 'Все юзеры' })
  @ApiResponse({ status: 200, type: Admin })
  @Get('/users')
  getAll(@Query() data: GetAllUsersDto) {
    return this.adminsService.getAllUsers(data);
  }

}
