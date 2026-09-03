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
  StudentReportDisciplinary,
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

    for (let i = 0; i < data.length; i++) {
      Object.assign(data[i], { recommendation: 'Parent Counseling' });
    }
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

    for (let i = 0; i < data.length; i++) {
      Object.assign(data[i], { recommendation: 'Parent Counseling' });
    }

    return data;
  }

  async getAtRiskStudent(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(AtRiskStudentNotification, 'ARS')
      .select(['ARS.*'])
      .andWhere('ARS.teacherID = :id', { id })
      .andWhere('ARS.transmuted_grade < 80')
      // .andWhere('ARS.read = 0')
      .orderBy('ARS.read', 'DESC')
      .getRawMany();

    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].transmuted_grade);

      let recommendation = '';

      if (data[i].remarks) {
        const match = data[i].remarks.match(/Recommendation:\s*(.*)$/i);

        if (match) {
          // Get the recommendation text
          recommendation = match[1].trim();

          // Remove "Recommendation: ..." from remarks
          data[i].remarks = data[i].remarks
            .replace(/\s*Recommendation:.*$/i, '')
            .trim();
        }
      }

      // Store extracted recommendation separately
      data[i].recommendation = recommendation;
    }
    // console.log('getAtRiskStudent', data);
    return data;
  }

  async getAtRiskStudentForFaculty(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(AtRiskStudentForFacultyNotification, 'ARS')
      .select(['ARS.*'])
      .andWhere('ARS.teacherID = :id', { id })
      .andWhere('ARS.transmuted_grade < 80')
      // .andWhere('ARS.read = 0')
      .orderBy('ARS.read', 'ASC')
      .getRawMany();

    for (let i = 0; i < data.length; i++) {
      console.log(data[i].transmuted_grade);

      let recommendation = '';

      if (data[i].remarks) {
        const match = data[i].remarks.match(/Recommendation:\s*(.*)$/i);

        if (match) {
          // Get the recommendation text
          recommendation = match[1].trim();

          // Remove "Recommendation: ..." from remarks
          data[i].remarks = data[i].remarks
            .replace(/\s*Recommendation:.*$/i, '')
            .trim();
        }
      }

      // Store extracted recommendation separately
      data[i].recommendation = recommendation;
    }
    return data;
  }

  async getParentNotification(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(Notification, 'N')
      .select(['N.*'])
      .andWhere('N.parentID = :id', { id })
      .andWhere('N.transmuted_grade < 80')
      .orderBy('N.read', 'ASC')
      .getRawMany();

    // console.log(data);
    return data;
  }

  async getPrefectSeniorHighReport(assignedMod: number) {
    let SHS = ['Grade 11', 'Grade 12'];
    let JHS = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 12'];
    let data = await this.dataSource.manager
      .createQueryBuilder(StudentReportDisciplinary, 'SR')
      .select([
        'SR.*',
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',ES.fname,' ',SUBSTRING(ES.mname, 1, 1) ,'. ') ,concat(ES.lname, ' ', ES.fname)) as student_name",
      ])
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SR.studentID')
      .where('SR.grade_level IN (:...studentIds)', {
        studentIds: assignedMod == 23 ? SHS : JHS,
      })
      .orderBy('SR.read', 'ASC')
      .getRawMany();
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

  updatePrefect(
    id: number,
    updateAtRiskStudentNotificationDto: UpdateAtRiskStudentNotificationDto,
  ) {
    try {
      this.dataSource.manager.update(StudentReportDisciplinary, id, {
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
