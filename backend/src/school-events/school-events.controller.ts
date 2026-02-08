import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  Res,
  Request,
  Response,
  UploadedFiles,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { SchoolEventsService } from './school-events.service';
import { CreateSchoolEventDto } from './dto/create-school-event.dto';
import { UpdateSchoolEventDto } from './dto/update-school-event.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs';
import { join, extname } from 'path';

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

  @Post('/addEvent')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.event_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  addEvent(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
    @Headers() headers,
  ) {
    const bodystring = JSON.parse(request.body.body);
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.schoolEventsService.addEvent(bodystring, files, curr_user);
  }

  @Post('/update-event-file')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.event_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  async update_event_file(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    const bodystring = JSON.parse(request.body.body);
    if (bodystring.oldFile) {
      fs.unlink(
        join(
          process.cwd(),
          process.env.FILE_PATH + `event_file/${bodystring.oldFile}`,
        ),
        async (err) => {
          if (err) {
            console.log(err);
          }
        },
      );
    }
    return this.schoolEventsService.update_event_file(bodystring, files);
  }

  @Get('getEventImg/:filename')
  getEventImg(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res,
  ): StreamableFile {
    const filePath = join(
      process.cwd(),
      process.env.FILE_PATH,
      'event_file',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    const ext = extname(filename).toLowerCase();

    const contentTypeMap = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    };

    res.setHeader(
      'Content-Type',
      contentTypeMap[ext] || 'application/octet-stream',
    );

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Get('view/eventFile/:data')
  getFile(
    @Param('data') data: string,
    @Res({ passthrough: true }) res,
  ): StreamableFile {
    let content_type = '';
    // console.log(data)
    let datasplited = data.split('.');
    if (datasplited[datasplited.length - 1] == 'jpeg') {
      content_type = 'image/jpeg';
    } else if (datasplited[datasplited.length - 1] == 'jpg') {
      content_type = 'image/jpg';
    } else if (datasplited[datasplited.length - 1] == 'png') {
      content_type = 'image/png';
    } else if (datasplited[datasplited.length - 1] == 'pdf') {
      content_type = 'application/pdf';
    } else if (datasplited[datasplited.length - 1] == 'mp4') {
      content_type = 'video/mp4';
    } else if (datasplited[datasplited.length - 1] == 'avi') {
      content_type = 'video/x-msvideo';
    } else if (datasplited[datasplited.length - 1] == 'mov') {
      content_type = 'video/quicktime';
    } else if (datasplited[datasplited.length - 1] == 'wmv') {
      content_type = 'video/x-ms-wmv';
    } else if (datasplited[datasplited.length - 1] == '3gp') {
      content_type = 'video/3gpp';
    } else if (datasplited[datasplited.length - 1] == 'flv') {
      content_type = 'video/x-flv';
    } else if (datasplited[datasplited.length - 1] == 'doc') {
      content_type = 'application/msword';
    }

    const file = createReadStream(
      join(process.cwd(), process.env.FILE_PATH + 'event_file/' + data),
    );
    res.set({
      'Content-Type': content_type,
    });
    return new StreamableFile(file);
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
