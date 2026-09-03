import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  UseInterceptors,
  Response,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { ESigsService } from './e-sigs.service';
import { CreateESigDto } from './dto/create-e-sig.dto';
import { UpdateESigDto } from './dto/update-e-sig.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { ParseFile } from 'src/user-details/validation/parse-file.pipe';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
@Controller('e-sigs')
export class ESigsController {
  constructor(private readonly eSigsService: ESigsService) {}

  @Post()
  create(@Body() createESigDto: CreateESigDto) {
    return this.eSigsService.create(createESigDto);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('uploadEsign')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.esign_filepath,
        filename: Helper.customFileName,
      }),
    }),
  )
  async uploadEsign(@UploadedFile(ParseFile) file, @Headers() headers) {
    var head_str = headers.authorization;

    const curr_user = currentUser(head_str);

    return this.eSigsService.uploadEsign(file.file.filename, curr_user);
  }

  @Get('getEsign/:filename')
  getEsign(
    @Param('filename') filename: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    const filePath = join(
      process.cwd(),
      process.env.FILE_PATH,
      'uploadedEsigImg',
      filename,
    );

    console.log('E-SIGN PATH:', filePath);

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'image/png',
    });
    file.on('error', (err) => {
      console.error(err);
    });

    return new StreamableFile(file);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.eSigsService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('checkForEsig/:id')
  checkForEsig(@Param('id') id: string) {
    return this.eSigsService.checkForEsig(+id);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getMyEsign')
  getMyEsign(@Headers() headers) {
    var head_str = headers.authorization;

    const curr_user = currentUser(head_str);

    return this.eSigsService.getMyEsign(curr_user);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getEmployeeEsign/:id')
  getEmployeeEsign(@Param('id') id: string) {
    return this.eSigsService.getEmployeeEsign(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eSigsService.findOne(+id);
  // }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateESigDto: UpdateESigDto) {
    return this.eSigsService.update(+id, updateESigDto);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eSigsService.remove(+id);
  }
}
