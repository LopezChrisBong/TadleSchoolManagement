import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSchoolEventDto } from './dto/create-school-event.dto';
import { UpdateSchoolEventDto } from './dto/update-school-event.dto';
import { DataSource, Repository } from 'typeorm';
import { SchoolEvent, UserDetail } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class SchoolEventsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(SchoolEvent)
    private readonly schoolEventRepository: Repository<SchoolEvent>,
  ) {}
  async create(createSchoolEventDto: CreateSchoolEventDto, curr_user: any) {
    try {
      let data = this.dataSource.manager.create(SchoolEvent, {
        eventName: createSchoolEventDto.eventName,
        eventDate: createSchoolEventDto.eventDate,
        eventDescription: createSchoolEventDto.eventDescription,
        eventType: createSchoolEventDto.eventType,
        schoolYearID: createSchoolEventDto.schoolYearID,
        addedBy: curr_user.userdetail.id,
      });
      await this.dataSource.manager.save(data);
      return {
        msg: 'Save successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async addEvent(body: any, filename: any, curr_user: any) {
    try {
      let data = this.dataSource.manager.create(SchoolEvent, {
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventDescription: body.eventDescription,
        eventType: body.eventType,
        schoolYearID: body.schoolYearID,
        addedBy: curr_user.userdetail.id,
        eventFile: filename[0].filename,
      });
      await this.dataSource.manager.save(data);
      return {
        msg: 'Save successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async update_event_file(body: any, filename: any) {
    try {
      this.dataSource.manager.update(SchoolEvent, body.id, {
        eventDate: body.eventDate,
        eventDescription: body.eventDescription,
        eventName: body.eventName,
        eventFile: filename[0].filename,
        isActive: body.isActive,
      });
      return {
        msg: 'Updated successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getAllEventByType(type: string, filter: number) {
    let eventData = await this.dataSource
      .createQueryBuilder(SchoolEvent, 'se')
      .select([
        'se.*',
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
      ])
      .leftJoin(UserDetail, 'ud', 'ud.id = se.addedBy')
      .where('se.eventType = :type', { type })
      .andWhere('se.schoolYearID = :filter', { filter })
      .orderBy('se.created_at', 'DESC')
      .getRawMany();
    // console.log(eventData)
    return eventData;
  }
  async getEventsWithMandatory() {
    const events = await this.dataSource
      .getRepository(SchoolEvent)
      .createQueryBuilder('se')
      // .where('se.eventType != :type', { type: 'Mandatory' })
      .select([
        'se.eventType',
        'se.eventName',
        'se.eventDate',
        'se.eventDescription',
      ])
      .orderBy('se.eventDate', 'ASC')
      .getMany();

    let eventData = this.groupByEventType(events);
    // console.log(eventData);
    return eventData;
  }

  async getEventsExcepMandatory() {
    const events = await this.dataSource
      .getRepository(SchoolEvent)
      .createQueryBuilder('se')
      .where('se.eventType != :type', { type: 'Mandatory' })
      .andWhere('se.isActive = 1')
      .select([
        'se.eventType',
        'se.eventName',
        'se.eventDate',
        'se.eventDescription',
        'se.eventFile',
      ])
      .orderBy('se.eventDate', 'ASC')
      .getMany();

    let eventData = this.groupByEventType(events);
    return eventData;
  }

  // private groupByEventType(events: SchoolEvent[]) {
  //   const grouped = {};

  //   events.forEach((event) => {
  //     if (!grouped[event.eventType]) {
  //       grouped[event.eventType] = [];
  //     }

  //     grouped[event.eventType].push({
  //       eventName: event.eventName,
  //       eventDate: event.eventDate,
  //       eventDescription: event.eventDescription,
  //       eventFile: event.eventFile,
  //     });
  //   });

  //   return {
  //     event: grouped,
  //   };
  // }
  private groupByEventType(events: SchoolEvent[]) {
    const grouped: Record<string, any[]> = {};

    events.forEach((event) => {
      if (!grouped[event.eventType]) {
        grouped[event.eventType] = [];
      }

      grouped[event.eventType].push({
        eventName: event.eventName,
        eventDate: event.eventDate,
        eventDescription: event.eventDescription,
        eventFile: event.eventFile
          ? `${process.env.SERVER}/school-events/getEventImg/${event.eventFile}`
          : null, // or fallback URL if you want
      });
    });

    return {
      event: grouped,
    };
  }

  findAll() {
    return `This action returns all schoolEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolEvent`;
  }

  update(id: number, updateSchoolEventDto: UpdateSchoolEventDto) {
    console.log(updateSchoolEventDto);
    try {
      this.dataSource.manager.update(SchoolEvent, id, {
        eventDate: updateSchoolEventDto.eventDate,
        eventDescription: updateSchoolEventDto.eventDescription,
        eventName: updateSchoolEventDto.eventName,
        isActive: updateSchoolEventDto.isActive,
      });
      return {
        msg: 'Updated successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async remove(id: number) {
    try {
      await this.schoolEventRepository.delete(id);
      return {
        msg: 'Deleted successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Deletion failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
