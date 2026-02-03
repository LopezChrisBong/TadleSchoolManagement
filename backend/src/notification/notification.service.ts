import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  AddStrand,
  AddTracks,
  EnrollStudent,
  RoomsSection,
  SchoolYear,
  StudentList,
  UserDetail,
  StudentAttendance,
  StudentGrade,
  TransmutedGrade,
  StudentQuarterFinalGrade,
  ParentRecord,
  Subject,
  LardoStudentNotification,
  AtRiskStudentNotification,
  Notification,
  LardoStudentForFacultyNotification,
  AtRiskStudentForFacultyNotification,
} from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UpdateLardoStudentNotificationDto } from './dto/update-lardo-student-notification.dto';
import { UpdateLardoStudentForFacultyNotificationDto } from './dto/update-lardo-student-for-faculty-notification.dto';
import { UpdateAtRiskStudentNotificationDto } from './dto/update-at-risk-student-notification.dto';
import { UpdateAtRiskStudentForFacultyNotificationDto } from './dto/update-at-risk-student-for-faculty-notification.dto';
@Injectable()
export class NotificationService {
  constructor(private dataSource: DataSource) {}

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async getLardoStudent(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(LardoStudentNotification, 'LSN')
      .select(['LSN.*'])
      .andWhere('LSN.teacherID = :id', { id })
      // .andWhere('LSN.read = 0')
      .orderBy('LSN.read', 'ASC')
      .getRawMany();

    // console.log('Lardo', data)
    return data;
  }

  async getLardoStudentForFaculty(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(LardoStudentForFacultyNotification, 'LSN')
      .select(['LSN.*'])
      .andWhere('LSN.teacherID = :id', { id })
      // .andWhere('LSN.read = 0')
      .orderBy('LSN.read', 'ASC')
      .getRawMany();

    // console.log('Lardo', data)
    return data;
  }

  async getAtRiskStudent(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(AtRiskStudentNotification, 'ARS')
      .select(['ARS.*'])
      .andWhere('ARS.teacherID = :id', { id })
      // .andWhere('ARS.read = 0')
      .orderBy('ARS.read', 'ASC')
      .getRawMany();

    // console.log('At Risk', data)
    return data;
  }

  async getAtRiskStudentForFaculty(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(AtRiskStudentForFacultyNotification, 'ARS')
      .select(['ARS.*'])
      .andWhere('ARS.teacherID = :id', { id })
      // .andWhere('ARS.read = 0')
      .orderBy('ARS.read', 'ASC')
      .getRawMany();

    // console.log('At Risk', data)
    return data;
  }

  async getParentNotification(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(Notification, 'N')
      .select(['N.*'])
      .andWhere('N.parentID = :id', { id })
      .orderBy('N.read', 'ASC')
      .getRawMany();

    // console.log('Notif Parent', data)
    return data;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      this.dataSource.manager.update(Notification, id, {
        read: updateNotificationDto.read,
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

  updateLardoAdviser(
    id: number,
    updateLardoStudentNotificationDto: UpdateLardoStudentNotificationDto,
  ) {
    try {
      this.dataSource.manager.update(LardoStudentNotification, id, {
        read: updateLardoStudentNotificationDto.read,
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

  updateLardoFaculty(
    id: number,
    updateLardoStudentForFacultyNotificationDto: UpdateLardoStudentForFacultyNotificationDto,
  ) {
    try {
      this.dataSource.manager.update(LardoStudentForFacultyNotification, id, {
        read: updateLardoStudentForFacultyNotificationDto.read,
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

  updateAtRiskAdviser(
    id: number,
    updateAtRiskStudentNotificationDto: UpdateAtRiskStudentNotificationDto,
  ) {
    try {
      this.dataSource.manager.update(AtRiskStudentNotification, id, {
        read: updateAtRiskStudentNotificationDto.read,
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

  updateAtRiskFaculty(
    id: number,
    updateAtRiskStudentForFacultyNotificationDto: UpdateAtRiskStudentForFacultyNotificationDto,
  ) {
    try {
      this.dataSource.manager.update(AtRiskStudentForFacultyNotification, id, {
        read: updateAtRiskStudentForFacultyNotificationDto.read,
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

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
