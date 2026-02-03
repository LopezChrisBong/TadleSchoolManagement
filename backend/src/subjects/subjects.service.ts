import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DataSource, Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import {
  Availability,
  GradeLevel,
  RoomsSection,
  TeacherGradeLevel,
  TeacherSubject,
  UserDetail,
} from 'src/entities';
import { CreateTeacherGradeLevelDto } from './dto/create-teacher-gradeLevel.dto';

@Injectable()
export class SubjectsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto, curr_user: any) {
    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="' + curr_user.userdetail.id + '"',
    );

    try {
      let data = this.dataSource.manager.create(Subject, {
        subject_title: createSubjectDto.subject_title,
        indicator: createSubjectDto.indicator,
        sub_subject: createSubjectDto.sub_subject,
        grade_level: createSubjectDto.grade_level,
        writen_works: createSubjectDto.writen_works,
        performance_task: createSubjectDto.performance_task,
        quarter_assessment: createSubjectDto.quarter_assessment,
        status: user[0].status,
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

  async getSpicificSubject(id: number, filter: number, grade: string) {
    try {
      const user = await this.dataSource.query(
        'SELECT * FROM user_detail where id ="' + id + '"',
      );

      const count = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM teacher_subject where teachersId ="' +
          id +
          '"',
      );

      if (count[0].count != 0) {
        console.log('Data 1');
        let data = this.getSubjectTaagged(id);
        return data;
      }
      console.log('Data 2');

      let data = await this.dataSource.manager
        .createQueryBuilder(Subject, 'sub')

        .where('status ="' + user[0].status + '"')
        .orderBy('created_at', 'DESC')
        .getMany();
      return data;
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getMySubjects(curr_user: any) {
    try {
      let subjects = await this.dataSource.manager
        .createQueryBuilder(TeacherSubject, 'ts')
        .select(['*', 's.subject_title as subject_title'])
        .leftJoin(Subject, 's', 's.id = ts.subjectId')
        .where('ts.teachersId = :id', { id: curr_user.userdetail.id })
        .orderBy('s.subject_title')
        .getRawMany();

      subjects = subjects.map((subj) => ({
        ...subj,
        active: 0,
      }));
      // console.log('Subjects', subjects);
      return subjects;
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getAllSubjectSF2(teacherID: number) {
    try {
      let subjects = await this.dataSource.manager
        .createQueryBuilder(TeacherSubject, 'ts')
        .select(['*', 's.subject_title as subject_title'])
        .leftJoin(Subject, 's', 's.id = ts.subjectId')
        .where('ts.teachersId = :id', { id: teacherID })
        .orderBy('s.subject_title')
        .getRawMany();

      subjects = subjects.map((subj) => ({
        ...subj,
        active: 0,
      }));
      // console.log('Subjects', subjects);
      return subjects;
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getMyClassRecord(curr_user: any, filter: number, tab: number) {
    // console.log(filter)
    try {
      let classRecord = await this.dataSource.manager
        .createQueryBuilder(TeacherSubject, 'ts')
        .select(['*', 's.subject_title as subject_title'])
        .leftJoin(Subject, 's', 's.id = ts.subjectId')
        .leftJoin(Availability, 'a', 'a.subjectId = s.id')
        .leftJoin(RoomsSection, 'rs', 'rs.id = a.roomId')
        .where('a.teacherID = :id', { id: curr_user.userdetail.id })
        .andWhere('s.id = :tab', { tab: tab })
        .andWhere('a.school_yearId = :filter', { filter: filter })
        .groupBy('rs.room_section')
        .orderBy('rs.room_section', 'ASC')
        .getRawMany();

      // console.log(classRecord)
      return classRecord;
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getAllFacultySF2(filter: number, teacherID: number) {
    console.log(filter, teacherID);
    try {
      let classRecord = await this.dataSource.manager
        .createQueryBuilder(TeacherSubject, 'ts')
        .select(['*', 's.subject_title as subject_title'])
        .leftJoin(Subject, 's', 's.id = ts.subjectId')
        .leftJoin(Availability, 'a', 'a.subjectId = s.id')
        .leftJoin(RoomsSection, 'rs', 'rs.id = a.roomId')
        .where('a.teacherID = :id', { id: teacherID })
        // .andWhere('s.id = :tab', { tab: tab })
        .andWhere('a.school_yearId = :filter', { filter: filter })
        .groupBy('rs.room_section')
        .orderBy('rs.room_section', 'ASC')
        .getRawMany();
      // console.log(classRecord)
      return classRecord;
    } catch (error) {
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async activeSubject(curr_user: any, gradeLevel: string) {
    // console.log(gradeLevel)
    // let userStatus =
    // await this.dataSource.manager.createQueryBuilder(UserDetail,'ud')
    // .select('*')
    // // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    // .where('ud.id = "'+curr_user.userdetail.id+'"')
    // .getRawOne()

    // let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    // // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    // .where('status = "'+userStatus.status+'"')
    // .orderBy('subject_title', 'ASC')
    // .getMany()

    let data = await this.dataSource.manager
      .createQueryBuilder(Subject, 'sub')
      .where('grade_level = "' + gradeLevel + '"')
      .orderBy('subject_title', 'ASC')
      .getMany();
    return data;
  }

  async getAllSubject(curr_user: any) {
    // let userStatus =
    // await this.dataSource.manager.createQueryBuilder(UserDetail,'ud')
    // .select('*')
    // // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    // .where('ud.id = "'+curr_user.userdetail.id+'"')
    // .getRawOne()

    // let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    // // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    // .where('status = "'+userStatus.status+'"')
    // .orderBy('subject_title', 'ASC')
    // .getMany()

    let data = await this.dataSource.manager
      .createQueryBuilder(Subject, 'sub')
      // .where('grade_level = "'+gradeLevel+'"')
      .orderBy('subject_title', 'ASC')
      .getMany();
    return data;
  }

  async getFacultyList(grade: string) {
    let data = await this.dataSource.manager
      .createQueryBuilder(TeacherGradeLevel, 'ts')
      .select([
        '*',
        'ts.id as grade_level',
        "IF (!ISNULL(us.mname) AND LOWER(us.mname) != 'n/a', concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as name",
      ])
      .leftJoin(UserDetail, 'us', 'us.id = ts.teachersId')
      .where('ts.grade_level = "' + grade + '"')
      .getRawMany();
    return data;
  }

  async addTeachersSubject(createTeacherSubjectDto: CreateTeacherSubjectDto) {
    try {
      let subjectList = JSON.parse(createTeacherSubjectDto.subject_list);
      let removeSubjects = JSON.parse(createTeacherSubjectDto.removed_subjects);
      console.log(
        subjectList,
        removeSubjects.length,
        createTeacherSubjectDto.userID,
      );
      if (removeSubjects.length > 0) {
        for (let i = 0; i < removeSubjects.length; i++) {
          await this.dataSource.manager.delete(
            TeacherSubject,
            removeSubjects[i].subjectListId,
          );
        }
      }

      for (let i = 0; i < subjectList.length; i++) {
        if (!subjectList[i].subjectListId) {
          let addSubject = this.dataSource.manager.create(TeacherSubject, {
            teachersId: createTeacherSubjectDto.userID,
            subjectId: subjectList[i].id,
          });

          await this.dataSource.manager.save(addSubject);
        }
      }
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!',
        status: HttpStatus.CREATED,
      };
    }
  }

  async addTeachersGradeLevel(
    createTeacherGradeLevelDto: CreateTeacherGradeLevelDto,
  ) {
    try {
      let gradeLevel_list = JSON.parse(
        createTeacherGradeLevelDto.gradeLevel_list,
      );
      let removed_gradeLevel = JSON.parse(
        createTeacherGradeLevelDto.removed_gradeLevel,
      );
      // console.log(gradeLevel_list, removed_gradeLevel,createTeacherGradeLevelDto.userID)
      if (removed_gradeLevel.length > 0) {
        for (let i = 0; i < removed_gradeLevel.length; i++) {
          await this.dataSource.manager.delete(
            TeacherGradeLevel,
            removed_gradeLevel[i].gradeListId,
          );
        }
      }

      for (let i = 0; i < gradeLevel_list.length; i++) {
        if (!gradeLevel_list[i].gradeListId) {
          let addGrade = this.dataSource.manager.create(TeacherGradeLevel, {
            teachersId: createTeacherGradeLevelDto.userID,
            grade_level: gradeLevel_list[i].id,
          });
          console.log('Grade', addGrade);
          await this.dataSource.manager.save(addGrade);
        }
      }
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Something went wrong!',
        status: HttpStatus.CREATED,
      };
    }
  }

  async getSubjectTaagged(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(TeacherSubject, 'ts')
      .select(['*', 'ts.id as subjectListId'])
      .leftJoin(Subject, 'su', 'su.id = ts.subjectId')
      .where('ts.teachersId = "' + id + '"')
      .getRawMany();
    return data;
  }

  async getGradeTaagged(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(TeacherGradeLevel, 'tg')
      .select(['*', 'tg.id as gradeListId'])
      .leftJoin(GradeLevel, 'g', 'g.id = tg.grade_level')
      .where('tg.teachersId = "' + id + '"')
      .getRawMany();
    return data;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    try {
      this.dataSource.manager.update(Subject, id, {
        subject_title: updateSubjectDto.subject_title,
        indicator: updateSubjectDto.indicator,
        sub_subject: updateSubjectDto.sub_subject,
        grade_level: updateSubjectDto.grade_level,
        writen_works: updateSubjectDto.writen_works,
        performance_task: updateSubjectDto.performance_task,
        quarter_assessment: updateSubjectDto.quarter_assessment,
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
    return `This action removes a #${id} subject`;
  }
}
