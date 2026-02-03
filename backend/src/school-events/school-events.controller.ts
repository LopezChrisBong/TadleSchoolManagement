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
import { SchoolEventsService } from './school-events.service';
import { CreateSchoolEventDto } from './dto/create-school-event.dto';
import { UpdateSchoolEventDto } from './dto/update-school-event.dto';
import { currentUser } from 'src/shared/jwtDecode';
@Controller('school-events')
export class SchoolEventsController {
  constructor(private readonly schoolEventsService: SchoolEventsService) {}

  @Post()
  create(
    @Body() createSchoolEventDto: CreateSchoolEventDto,
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.schoolEventsService.create(createSchoolEventDto, curr_user);
  }

  @Get('getEventsWithMandatory')
  getEventsWithMandatory() {
    return this.schoolEventsService.getEventsWithMandatory();
  }

  @Get('getEventsExcepMandatory')
  getEventsExcepMandatory() {
    return this.schoolEventsService.getEventsExcepMandatory();
  }

  @Get()
  findAll() {
    return this.schoolEventsService.findAll();
  }

  @Get('getAllEventByType/:type/:filter')
  getAllEventByType(
    @Param('type') type: string,
    @Param('filter') filter: string,
  ) {
    return this.schoolEventsService.getAllEventByType(type, +filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolEventsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchoolEventDto: UpdateSchoolEventDto,
  ) {
    return this.schoolEventsService.update(+id, updateSchoolEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolEventsService.remove(+id);
  }
}
