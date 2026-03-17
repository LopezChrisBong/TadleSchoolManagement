import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { currentUser } from 'src/shared/jwtDecode';
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Post('addComment')
  addComment(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.addComment(createAnnouncementDto);
  }

  @Get('getMyAnnouncement/:filter')
  getMyAnnouncement(@Param('filter') filter: string, @Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.announcementService.getMyAnnouncement(+filter, curr_user);
  }

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.update(+id, updateAnnouncementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementService.remove(+id);
  }
}
