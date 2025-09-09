import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomsSectionDto } from './dto/create-rooms-section.dto';
import { UpdateRoomsSectionDto } from './dto/update-rooms-section.dto';
import { AddStrand, AddTracks, EnrollStudent, RoomsSection, SchoolYear, StudentList, UserDetail,StudentAttendance,StudentGrade, TransmutedGrade,StudentQuarterFinalGrade } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddTrackDto } from './dto/create-add-track.dto';
import { UpdateAddTrackDto } from './dto/update-add-track.dto';
import { CreateAddStrandDto } from './dto/create-add-strand.dto';
import { UpdateAddStrandDto } from './dto/update-add-strand.dto';
import { CreateStudentListDto } from './dto/create-student-list.dto';
import { CreateAddStudentRoomDto } from './dto/create-add-student-room.dto';
import { CreateStudentAttendanceDto } from './dto/create-student-attendance.dto';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { CreateTransmutedGradeDto } from './dto/create-transmuted-grade.dto';
import { UpdateTransmutedGradeDto } from './dto/update-transmuted-grade.dto';
import { CreateStudentQuarterFinalGradeDto } from './dto/create-student-quarter-final-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';

@Injectable()
export class RoomsSectionService {
  constructor(private dataSource: DataSource,
    @InjectRepository(RoomsSection)
    private readonly subjectRepository: Repository<RoomsSection>,
    @InjectRepository(StudentList)
    private readonly studentListRepository: Repository<StudentList>,
  ){}


  async create(createRoomsSectionDto: CreateRoomsSectionDto) {
    console.log(createRoomsSectionDto)

      try {
        let data = this.dataSource.manager.create(RoomsSection,{
          room_section: createRoomsSectionDto.room_section,
          grade_level:createRoomsSectionDto.grade_level,
          teacherId:createRoomsSectionDto.teacherId,
          strandId:createRoomsSectionDto.strandId,
        })
        await this.dataSource.manager.save(data)
        return{
          msg:'Save successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
  
    }

    
  async addTrack(createAddTrackDto: CreateAddTrackDto) {

      try {
        let data = this.dataSource.manager.create(AddTracks,{
          tracks_name: createAddTrackDto.tracks_name,
        })
        await this.dataSource.manager.save(data)
        return{
          msg:'Save successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
    }

    async studentAttendance(createStudentAttendanceDto:CreateStudentAttendanceDto){
      let data = JSON.parse(createStudentAttendanceDto.data)
      try {
          for (let i = 0; i < data.length; i++) {
          let saveData = this.dataSource.manager.create(StudentAttendance,{
                roomID: data[i].roomId,
                attendance:data[i].attendance,
                school_yearID:data[i].school_yearId,
                studentID:data[i].studentId,
                subjectID:createStudentAttendanceDto.subjectID,
                attendanceDate:createStudentAttendanceDto.attendanceDate,
                teacherID:createStudentAttendanceDto.teacherID
          })
            await this.dataSource.manager.save(saveData)
          }
          return{
            msg:'Save successfully!', status:HttpStatus.CREATED
            }
      } catch (error) {
      return{
            msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
            }
      }

    }

    async quarterFinalGrade(createStudentQuarterFinalGradeDto:CreateStudentQuarterFinalGradeDto){
            let data = JSON.parse(createStudentQuarterFinalGradeDto.data)
        //     console.log(data[0].studentLRN,data[0].studentID)
        //  let newData = data[0].MAPEH ? 'Naay Data':'Walay Data'
        //  console.log( data[0].MAPEH.initial_grade,data[0].MAPEH.transmuted_grade)
          try {
              for (let i = 0; i < data.length; i++) {
              let saveData = this.dataSource.manager.create(StudentQuarterFinalGrade,{
                    roomID: createStudentQuarterFinalGradeDto.roomID,
                    subjectID:createStudentQuarterFinalGradeDto.subjectID,
                    school_yearID:createStudentQuarterFinalGradeDto.school_yearID,
                    semester:createStudentQuarterFinalGradeDto.semester,
                    quarter:createStudentQuarterFinalGradeDto.quarter,
                    sub_subject:data[i].MAPEH ? JSON.stringify(data[i].MAPEH.sub_subjects) : null,
                    transmuted_grade:data[i].MAPEH ? data[i].MAPEH.transmuted_grade : data[i].transmuted_grade,
                    initial_grade:data[i].MAPEH ? data[i].MAPEH.initial_grade : data[i].initial_grade,
                    studentID:data[i].studentID,
                    studentLRN:data[i].studentLRN,
                    teacherID:createStudentQuarterFinalGradeDto.teacherID
              })
                await this.dataSource.manager.save(saveData)
              }
              return{
                msg:'Save successfully!', status:HttpStatus.CREATED
                }
          } catch (error) {
          return{
                msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
                }
          }
    }

    async transmutedGrade(createTransmutedGradeDto:CreateTransmutedGradeDto){
      // console.log('Transmuted Grade',createTransmutedGradeDto)
     let conflict =await this.conflictTansmuted(createTransmutedGradeDto.transmuted_grade)
      if(conflict == 1){
       return{
          msg:'Transmuted grade already exist!', status:HttpStatus.BAD_REQUEST
        }
      }
      else{
        try {
        let data = this.dataSource.manager.create(TransmutedGrade,{
          start_range: createTransmutedGradeDto.start_range,
          end_range: createTransmutedGradeDto.end_range,
          transmuted_grade: createTransmutedGradeDto.transmuted_grade,
        })
        await this.dataSource.manager.save(data)
        return{
          msg:'Save successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
      }

    }

    async conflictTansmuted(transmuted:number){
    const genCount = await this.dataSource.query(
      // 'SELECT COUNT(*) as count_gen FROM student_list where grade_level = "Grade 9" and  school_yearId = "'+filter+'"',
      'SELECT COUNT(*) as count_gen FROM transmuted_grade as t where t.transmuted_grade = "'+transmuted+'"',
    );
    // console.log(genCount[0].count_gen)
    return genCount[0].count_gen
    }

    async studentGrade(createStudentGradeDto:CreateStudentGradeDto){
      let data = JSON.parse(createStudentGradeDto.data)
      console.log(createStudentGradeDto.sub_subject)
      try {
          for (let i = 0; i < data.length; i++) {
          let saveData = this.dataSource.manager.create(StudentGrade,{
                roomID: data[i].roomId,
                school_yearID:data[i].school_yearId,
                sub_subject:createStudentGradeDto.sub_subject,
                studentID:data[i].studentId,
                subjectID:createStudentGradeDto.subjectID,
                quarter:createStudentGradeDto.quarter,
                quarterScore:data[i].quarterScore,
                semester:createStudentGradeDto.semester,
                highest_posible_score:createStudentGradeDto.highest_posible_score,
                type:createStudentGradeDto.type
          })
            await this.dataSource.manager.save(saveData)
          }
          return{
            msg:'Save successfully!', status:HttpStatus.CREATED
            }
      } catch (error) {
      return{
            msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
            }
      }
    }

    async addStrand(createAddStrandDto: CreateAddStrandDto) {

        try {
          let data = this.dataSource.manager.create(AddStrand,{
            strand_name: createAddStrandDto.strand_name,
            trackId: createAddStrandDto.trackId,
          })
          await this.dataSource.manager.save(data)
          return{
            msg:'Save successfully!', status:HttpStatus.CREATED
          }
        } catch (error) {
          return{
            msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
          }
        }
      }

      async addStudentClassRoom(createAddStudentRoomDto: CreateAddStudentRoomDto) {
          let studentList = JSON.parse(createAddStudentRoomDto.stundent_list)
          let removeStudent = JSON.parse(createAddStudentRoomDto.removed_student)
          console.log(studentList, removeStudent.length,createAddStudentRoomDto.classID)
        try {
       
          if(removeStudent.length>0){
            for (let i = 0; i < removeStudent.length; i++) {
            
              await this.dataSource.manager.delete(StudentList, removeStudent[i].studentListId)
            }
          }

          for (let i = 0; i < studentList.length; i++) {
            if(!studentList[i].studentListId){
              let addStudent = this.dataSource.manager.create(StudentList, {
                roomId:parseInt(createAddStudentRoomDto.classID),
                studentId:studentList[i].id,
                grade_level:studentList[i].grade_level,
                school_yearId:studentList[i].school_yearId,
            })
           
            await this.dataSource.manager.save(addStudent)
            }
          }
          return{
            msg:'Saved successfully!',
            status: HttpStatus.CREATED
          }
    
        } catch (error) {
          return{
            msg:'Something went wrong!',
            status: HttpStatus.CREATED
          }
        }
      }

      async addMyStudentClassRoom(createAddStudentRoomDto: CreateAddStudentRoomDto) {
          let studentList = JSON.parse(createAddStudentRoomDto.stundent_list)
          let newData = []
          for (let i = 0; i < studentList.length; i++) {
                let data = await this.dataSource.manager
              .createQueryBuilder(EnrollStudent, 'es')
              .select([
                "*",
                "IF (!ISNULL(es.mname)  AND LOWER(es.mname) != 'n/a', concat(es.fname, ' ',SUBSTRING(es.mname, 1, 1) ,'. ',es.lname) ,concat(es.fname, ' ', es.lname)) as name", 
              ])
              .where('es.id = :id', { id: studentList[i] })
              .getRawOne();
              newData.push(data)
          }
        try {
          for (let i = 0; i < newData.length; i++) {
              let addStudent = this.dataSource.manager.create(StudentList, {
                roomId:parseInt(createAddStudentRoomDto.classID),
                studentId:newData[i].id,
                grade_level:newData[i].grade_level,
                school_yearId:newData[i].school_yearId,
            })
            await this.dataSource.manager.save(addStudent)
          }
          return{
            msg:'Saved successfully!',
            status: HttpStatus.CREATED
          }
    
        } catch (error) {
          return{
            msg:'Something went wrong!',
            status: HttpStatus.CREATED
          }
        }
      }

 async getAllAttendanceByDate(date:string, roomID:number, subjectID:number) {
  //  console.log('date',date, roomID,subjectID )
    let data = await this.dataSource.manager
    .createQueryBuilder(StudentAttendance, 'SA')
    .select([
      "*",
      "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",  
    ])
    .leftJoin(EnrollStudent, 'ES', 'ES.id = SA.studentID')
     .where('SA.attendanceDate = :date', { date :date})
     .andWhere('SA.roomID = :roomID', { roomID :roomID})
     .andWhere('SA.subjectID = :subjectID', { subjectID :subjectID})
    .getRawMany();
  //  console.log('program',data)
    return data
  }

  async getAllGradeByQuarter(quarter:string,semester:string,roomID:number, subjectID:number, type:number, school_yearID:number,sub_subject:number){
    console.log(semester,quarter,roomID,subjectID)
  let query =  this.dataSource.manager
    .createQueryBuilder()
    .select([
      "SG.id as SG_id",
      "SG.roomID as SG_roomID",
      "SG.studentID as SG_studentID",
      "SG.subjectID as SG_subjectID",
      "SG.quarterScore as SG_quarterScore",
      "SG.highest_posible_score as SG_highest_posible_score",
      "SG.school_yearID as SG_school_yearID",
      "SG.type as SG_type",
      "CONCAT('Quiz ', ROW_NUMBER() OVER(PARTITION BY SG.studentID, SG.subjectID, SG.type ORDER BY SG.created_at ASC)) as quiz_label",
      "IF (!ISNULL(ES.mname) AND LOWER(ES.mname) != 'n/a', CONCAT(ES.fname, ' ', SUBSTRING(ES.mname, 1, 1), '. ', ES.lname), CONCAT(ES.fname, ' ', ES.lname)) as name",
    ])
    .from(StudentGrade, "SG")
    .leftJoin(EnrollStudent, "ES", "ES.id = SG.studentID")
    .where("SG.quarter = :quarter", { quarter })
    .andWhere("SG.semester = :semester", { semester })
    .andWhere("SG.roomID = :roomID", { roomID })
    .andWhere("SG.subjectID = :subjectID", { subjectID })
    .andWhere("ES.statusEnrolled = 1")
    .andWhere("SG.type = :type", { type })
    .andWhere("SG.school_yearID = :school_yearID", { school_yearID })
    if(sub_subject){
      query.andWhere("SG.sub_subject = :sub_subject", { sub_subject })
    }
    let data = await query.getRawMany();

  // Group by quiz_label
  // const grouped: Record<string, any[]> = {};
  // data.forEach((row) => {
  //   if (!grouped[row.quiz_label]) {
  //     grouped[row.quiz_label] = [];
  //   }
  //   grouped[row.quiz_label].push(row);
  // });

  // console.log("program", data);
    return data
  }

  async getAllAttendanceWholeSemester(roomID:number, subjectID:number){
      console.log('Semester Attendance',roomID,subjectID)
        // Step 1: Get distinct attendance dates for this room & subject
  const dates = await this.dataSource.query(
    `
    SELECT DISTINCT attendanceDate
    FROM student_attendance
    WHERE roomID = ? AND subjectID = ?
    ORDER BY attendanceDate
    `,
    [roomID, subjectID]
  );

  if (!dates.length) {
    return []; // no attendance found
  }

  // Step 2: Build dynamic columns
  const dateColumns = dates
    .map(
      (d) =>
        `MAX(CASE WHEN a.attendanceDate = '${d.attendanceDate}' THEN a.attendance END) AS \`${d.attendanceDate}\``
    )
    .join(', ');

  // Step 3: Build and run final pivot query
  const sql = `
    SELECT 
      CONCAT(s.fname, ' ', s.lname) AS student_name,
      ${dateColumns}
    FROM student_attendance a
    JOIN enroll_student s ON a.studentID = s.id
    WHERE a.roomID = ? AND a.subjectID = ? AND s.statusEnrolled = 1
    GROUP BY s.id, s.fname, s.lname
    ORDER BY student_name
  `;
  // console.log(await this.dataSource.query(sql, [roomID, subjectID]));

  return this.dataSource.query(sql, [roomID, subjectID]);
      
  }

 async findAll(gradeLevel:string) {
   console.log('gradeLevel',gradeLevel)

    let data = await this.dataSource.manager
    .createQueryBuilder(RoomsSection, 'RS')
    .select([
      "*",
      'RS.id as id',
      "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name", 
    ])
    .leftJoin(UserDetail, 'ud', 'ud.id = RS.teacherId')
    .where('RS.grade_level = "'+gradeLevel+'"')
    .getRawMany();
  //  console.log('program',data)
    return data
  }

  async findSectionName(gradeLevel:string, section:number) {
    let data = await this.dataSource.manager
    .createQueryBuilder(RoomsSection, 'UD')
    .select([
      "*"
    ])
    .where('UD.grade_level = "'+gradeLevel+'"')
    .where('UD.id = "'+section+'"')
    .getRawMany();

    return data
  }

  async getAlltracks() {

 
    const toReturn = await this.dataSource.query(
      'SELECT * FROM add_tracks  order by tracks_name ASC',
    );
    return toReturn;
  }

   async getTransmutedGrade() {
    const toReturn = await this.dataSource.query(
      'SELECT * FROM transmuted_grade order by transmuted_grade DESC',
    );
    // console.log('Datass', toReturn)
    return toReturn;
  }

  async getCountGen(grade:string, filter:number) {

    const genCount = await this.dataSource.query(
      // 'SELECT COUNT(*) as count_gen FROM student_list where grade_level = "Grade 9" and  school_yearId = "'+filter+'"',
      'SELECT COUNT(*) as count_gen FROM student_list where grade_level = "'+grade+'" and  school_yearId = "'+filter+'"',
    );
    console.log(genCount[0].count_gen)

    return genCount;
  }


  async getConflictStrand(grade:string, filter:number, strandId: number) {

 
    const genCount = await this.dataSource.query(
      // 'SELECT COUNT(*) as count_gen FROM student_list where grade_level = "Grade 9" and  school_yearId = "'+filter+'"',
      'SELECT COUNT(*) as count_gen FROM student_list where grade_level = "'+grade+'" and  school_yearId = "'+filter+'" and strandId = "'+strandId+'"',
    );
    console.log(genCount[0].count_gen)

    return genCount[0].count_gen;
  }

async getConflictQuarterGrade(
  semester: string,
  filter: number,
  quarter: string,
  roomID: number,
  subjectID: number
) {
  console.log("Semester:", semester,filter,quarter,roomID,subjectID);

  try {
    const getCount = await this.dataSource.query(
      `
      SELECT COUNT(*) AS count_gen
      FROM student_quarter_final_grade
      WHERE school_yearId LIKE ?
        AND quarter LIKE ?
        AND roomID LIKE ?
        AND subjectID LIKE ?
        AND semester LIKE ?
      `,
      [filter, quarter, roomID, subjectID, semester]
    );
    console.log(getCount[0])
    return getCount.length > 0 ? getCount[0] : { count_gen: 0 };
  } catch (error) {
    console.error("Error fetching conflict quarter grade:", error);
    throw error; // rethrow so the caller can handle it
  }
}


  async getRoomClassList(id: number,grade:string, filter:number) {
      console.log('filterss',filter)

    let data = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as studentListId",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name", 
            ])
      .leftJoin(SchoolYear, 'SY', 'SY.id = SL.school_yearId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('SL.grade_level = "'+grade+'"')
      .andWhere('SL.roomId = '+id+'')
      .andWhere('SY.id = "'+filter+'"')
      .andWhere('ES.statusEnrolled = 1')
      .getRawMany();
    return data;
  }

  async getMyClassList(userID:number,filter:number){
    console.log(filter)
    try {
      let data = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as id",
        "RS.room_section as room_name",
        "RS.id as roomID",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name", 
            ])
      .leftJoin(RoomsSection, 'RS', 'RS.id = SL.roomId')
      .leftJoin(SchoolYear, 'SY', 'SY.id = SL.school_yearId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('RS.teacherId = :userId', { userId: userID })
      .andWhere('SY.id = :filter', { filter })
      .andWhere('ES.statusEnrolled = 1')
      .getRawMany();
      // console.log('Wal',data)
      if (!data || data.length === 0) {
         const userData = await this.dataSource
    .createQueryBuilder(RoomsSection, 'RS')
    .select(["RS.id as roomID", 'RS.room_section AS room_name', 'RS.grade_level as grade_level'])
    .where('RS.teacherId = :teacherId', { teacherId: userID })
    .getRawMany();
      // console.log('NEW DAR',userData)
      return userData;
      }else{
       return data;
      }
    } catch (error) {
              return{
            msg:'Something went wrong!' +error,
            status: HttpStatus.BAD_REQUEST
          }
    }

 
     
  }

async  getMyStudentAttendance(userID:number,filter:number, roomID:number){
  try {
        console.log(roomID, filter, userID)
      let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "*",
        "ES.id as id",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name", 
            ])
      .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
      .leftJoin(RoomsSection, 'RS', 'RS.id = SL.roomId')
      .leftJoin(SchoolYear, 'SY', 'SY.id = SL.school_yearId')
      // .where('RS.teacherId = :teacherId', { teacherId: userID })
      .andWhere('SY.id = :filter', { filter: filter})
      .andWhere('RS.id = :roomID', { roomID :roomID})
      .andWhere('ES.statusEnrolled = 1')
      .getRawMany();

       data = data.map(data => (Object.assign(Object.assign({}, data), { attendance: false })));
      // console.log(data)
      return data
    
    } catch (error) {
              return{
            msg:'Something went wrong!' +error,
            status: HttpStatus.BAD_REQUEST
          }
  }

  }

  async  getMyStudentClassRecords(userID:number,filter:number, roomID:number){
     console.log(roomID, filter, userID)
  try {
       
      let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "*",
        "ES.id as id",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name", 
            ])
      .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
      .leftJoin(RoomsSection, 'RS', 'RS.id = SL.roomId')
      .leftJoin(SchoolYear, 'SY', 'SY.id = SL.school_yearId')
      // .where('RS.teacherId = :teacherId', { teacherId: userID })
      .where('SY.id = :filter', { filter: filter})
      .andWhere('RS.id = :roomID', { roomID :roomID})
      .andWhere('ES.statusEnrolled = 1')
      .getRawMany();
      return data
    
    } catch (error) {
              return{
            msg:'Something went wrong!' +error,
            status: HttpStatus.BAD_REQUEST
          }
  }

  }

  async getGeneratedGrade(
  roomID: number,
  schoolyearID: number,
  quarter: string,
  semester: string,
  subjectID: number,
  sub_subject:string
) {

   console.log(sub_subject)
  if(sub_subject != 'noData'){
     const result = await this.dataSource.query(
    `CALL getquarterlygrades_mapeh(?, ?, ?, ?, ?)`,
    [roomID, schoolyearID, quarter, semester, subjectID]
  );
    let grades = result[0];
    
      for (let i = 0; i < grades.length; i++) {
    // 🔹 1. Check if there is already a submitted grade
    const submitted = await this.dataSource.query(
      `SELECT transmuted_grade, initial_grade
       FROM student_quarter_final_grade 
       WHERE roomID = ? 
         AND school_yearID = ? 
         AND studentID = ? 
         AND subjectID = ? 
         AND quarter = ? 
         AND semester = ? 
       LIMIT 1`,
      [
        roomID,
        schoolyearID,
        grades[i].studentID,
        subjectID,
        quarter,
        semester,
      ]
    );
              // if (submitted.length > 0) {
              //   const init = submitted[0].initial_grade;
              //   const trans = submitted[0].transmuted_grade;
              //   grades[i].initial_grade = init ? parseFloat(init) : null;
              //   grades[i].transmuted_grade = trans ? parseFloat(trans) : null;
              // } else {
              const gradeRecord = await this.dataSource.query(
                `SELECT transmuted_grade  
                FROM transmuted_grade 
                WHERE ? BETWEEN start_range AND end_range`,
                [grades[i].initial_grade]
              );
                if (gradeRecord.length > 0) {
                grades[i].transmuted_grade = gradeRecord[0].transmuted_grade;
              } else {
                grades[i].transmuted_grade = null; // fallback if no match
              }
            // }
          }
      // console.log(grades)
    return grades
  } 
  else{
      const result = await this.dataSource.query(
    `CALL get_quarterly_grades(?, ?, ?, ?, ?)`,
    [roomID, schoolyearID, quarter, semester, subjectID]
  );

  let grades = result[0];

  for (let i = 0; i < grades.length; i++) {
    // 🔹 1. Check if there is already a submitted grade
    const submitted = await this.dataSource.query(
      `SELECT transmuted_grade, initial_grade
       FROM student_quarter_final_grade 
       WHERE roomID = ? 
         AND school_yearID = ? 
         AND studentID = ? 
         AND subjectID = ? 
         AND quarter = ? 
         AND semester = ? 
       LIMIT 1`,
      [
        roomID,
        schoolyearID,
        grades[i].studentID,
        subjectID,
        quarter,
        semester,
      ]
    );
              if (submitted.length > 0) {
                const init = submitted[0].initial_grade;
                const trans = submitted[0].transmuted_grade;

                grades[i].initial_grade = init ? parseFloat(init) : null;
                grades[i].transmuted_grade = trans ? parseFloat(trans) : null;
              } else {
              // 🔹 Otherwise, calculate from transmuted_grade ranges
              const gradeRecord = await this.dataSource.query(
                `SELECT transmuted_grade  
                FROM transmuted_grade 
                WHERE ? BETWEEN start_range AND end_range`,
                [grades[i].initial_grade]
              );
                if (gradeRecord.length > 0) {
              grades[i].transmuted_grade = gradeRecord[0].transmuted_grade;
            } else {
              grades[i].transmuted_grade = null; // fallback if no match
            }
            }
          }
          // console.log('Not Mapeh', grades)

    return grades;
  }


  }
  

  async generateClassRecord(grade:string, filter:number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
   
try {
   const gradeRecord = await queryRunner.query(
      'SELECT * FROM enroll_student where grade_level = "'+grade+'" and school_yearId = "'+filter+'" and statusEnrolled = 1 ',
    );

    const room = await queryRunner.query(
      'SELECT *  FROM rooms_section where grade_level = "'+grade+'"',
    );

    // const students = Array.from({ length:gradeRecord.length }, (_, i) => ({ id: i + 1, lname: `Student ${i + 1}` }));
    // const rooms = Array.from({ length: room.length }, (_, i) => ({ id: i + 1, room_section: `Room ${i + 1}` }));

    // const gradeRecord = []
    // for (let index = 0; index < 50; index++) {
    //   const element ={id: +index , lname:'love'+index};
    //   gradeRecord.push(element)
    // }

    // const room = []
    // for (let index = 1; index <= 7; index++) {
    //   const element ={id: +index , lname:'love'+index};
    //   room.push(element)
    // }

   
    const gradeRecordclassList = []
    let roomIndex = 0;
   // Evenly distribute students across rooms
   gradeRecord.forEach((student, index) => {
    gradeRecordclassList.push({
      studentId: student.id,
      studentName: student.lname,
      roomId: room[roomIndex].id,
      roomName: room[roomIndex].lname,
    });

    // Move to the next room, cycle back to the first room after the last
    roomIndex = (roomIndex + 1) % room.length;
  });

//Save


for (let i = 0; i < gradeRecordclassList.length; i++) {
  
    let newTag = this.dataSource.manager.create(StudentList, {
      studentId:gradeRecordclassList[i].studentId,
      roomId:gradeRecordclassList[i].roomId,
      grade_level:grade,
      school_yearId:filter
  })
  await this.dataSource.manager.save(newTag)
}


  // const groupedByRoomId = gradeRecordclassList.reduce((acc, item) => {
  //   // If the roomId key doesn't exist in the accumulator, initialize it as an empty array
  //   if (!acc[item.roomId]) {
  //     acc[item.roomId] = [];
  //   }
  //   // Push the current item into the appropriate group
  //   acc[item.roomId].push(item);
  //   return acc;
  // }, {});
  // console.log(groupedByRoomId)
    // return { gradeLevel, classList };
    await queryRunner.release();
    // console.log(gradeRecord[0].student_no)
    
    
    return{
      msg:'Successfully generated list for "'+grade+'"!', 
      status:HttpStatus.CREATED
    }
  
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, 
    status:HttpStatus.BAD_REQUEST
  }
}
  
  }


  async genStrandRecord(grade:string, filter:number , strandId:number) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
   
try {
   const gradeRecord = await queryRunner.query(
      'SELECT * FROM enroll_student where grade_level = "'+grade+'" and school_yearId = "'+filter+'" and strand = "'+strandId+'" and statusEnrolled = 1 ',
    );

    const room = await queryRunner.query(
      'SELECT *  FROM rooms_section where grade_level = "'+grade+'" and strandId = "'+strandId+'"',
    );

    // const students = Array.from({ length:gradeRecord.length }, (_, i) => ({ id: i + 1, lname: `Student ${i + 1}` }));
    // const rooms = Array.from({ length: room.length }, (_, i) => ({ id: i + 1, room_section: `Room ${i + 1}` }));

    // const gradeRecord = []
    // for (let index = 0; index < 50; index++) {
    //   const element ={id: +index , lname:'love'+index};
    //   gradeRecord.push(element)
    // }

    // const room = []
    // for (let index = 1; index <= 7; index++) {
    //   const element ={id: +index , lname:'love'+index};
    //   room.push(element)
    // }

   
    const gradeRecordclassList = []
    let roomIndex = 0;
   // Evenly distribute students across rooms
   gradeRecord.forEach((student, index) => {
    gradeRecordclassList.push({
      studentId: student.id,
      studentName: student.lname,
      roomId: room[roomIndex].id,
      roomName: room[roomIndex].lname,
    });

    // Move to the next room, cycle back to the first room after the last
    roomIndex = (roomIndex + 1) % room.length;
  });

//Save


for (let i = 0; i < gradeRecordclassList.length; i++) {
  
    let stranRecord = this.dataSource.manager.create(StudentList, {
      studentId:gradeRecordclassList[i].studentId,
      roomId:gradeRecordclassList[i].roomId,
      grade_level:grade,
      school_yearId:filter,
      strandId:strandId
  })
  await this.dataSource.manager.save(stranRecord)
}


  // const groupedByRoomId = gradeRecordclassList.reduce((acc, item) => {
  //   // If the roomId key doesn't exist in the accumulator, initialize it as an empty array
  //   if (!acc[item.roomId]) {
  //     acc[item.roomId] = [];
  //   }
  //   // Push the current item into the appropriate group
  //   acc[item.roomId].push(item);
  //   return acc;
  // }, {});
  // console.log(groupedByRoomId)
    // return { gradeLevel, classList };
    await queryRunner.release();
    // console.log(gradeRecord[0].student_no)
    
    
    return{
      msg:'Successfully generated list for "'+grade+'"!', 
      status:HttpStatus.CREATED
    }
  
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, 
    status:HttpStatus.BAD_REQUEST
  }
}
  
  }
 async updateAddRecords(createStudentListDto:CreateStudentListDto, grade:string, sy:number , room:number){

  try {
    
  let conflict = await this.dataSource.manager
  .createQueryBuilder(StudentList, 'ES')
  .select([
    "COUNT(*) as conflict",
  ])
  .where('grade_level = "'+grade+'"')
  .andWhere('school_yearId = '+sy+'')
  .andWhere('roomId = '+room+'')
  .getRawMany();

  // console.log(conflict[0].conflict,sy,grade,room)

  if(conflict[0].conflict == 0){
  const studentList =  JSON.parse(JSON.stringify(createStudentListDto))
  for (let i = 0; i < studentList.length; i++) {
    let updateClassRecord = this.dataSource.manager.create(StudentList, {
      studentId:studentList[i].studentId,
      roomId:room,
      grade_level:grade,
      school_yearId:sy
   })

    await this.dataSource.manager.save(updateClassRecord)
  }
    return{
      msg:'Save successfully!', status:HttpStatus.CREATED
          }
    }
      return{
       msg:'Conflict on updating classlist, Please check duplicate school year, room name!',  status:HttpStatus.BAD_REQUEST
          }

  } catch (error) {
    return{
      msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
    }
  }

 }

  async AllStrand() {

    const toReturn = await this.dataSource.query(
      'SELECT *, add_strand.id as id FROM add_strand left join add_tracks on add_strand.trackId = add_tracks.id  order by strand_name ASC',
    );
    return toReturn;
  }

  async AllStrandEnroll(id:number) {

    const toReturn = await this.dataSource.query(
      'SELECT * FROM add_strand where trackId = '+id+' order by strand_name ASC',
    );
    return toReturn;
  }


  findOne(id: number) {
    return `This action returns a #${id} roomsSection`;
  }

  update(id: number, updateRoomsSectionDto: UpdateRoomsSectionDto) {

try {
    this.dataSource.manager.update(RoomsSection,id,{
    room_section:updateRoomsSectionDto.room_section,
    grade_level: updateRoomsSectionDto.grade_level,
    teacherId:updateRoomsSectionDto.teacherId,
    strandId:updateRoomsSectionDto.strandId
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }


  updateTrack(id: number, updateAddTrackDto: UpdateAddTrackDto) {
      try {
          this.dataSource.manager.update(AddTracks,id,{
          tracks_name:updateAddTrackDto.tracks_name,
        })
        return{
          msg:'Updated successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
  }

  updateTransmutedGrade(id:number,updateTransmutedGradeDto:UpdateTransmutedGradeDto){
      try {
          this.dataSource.manager.update(TransmutedGrade,id,{
          end_range:updateTransmutedGradeDto.end_range,
          start_range:updateTransmutedGradeDto.start_range,
          transmuted_grade:updateTransmutedGradeDto.transmuted_grade,
        })
        return{
          msg:'Updated successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
  }
  

  updateStrand(id: number, updateAddStrandDto: UpdateAddStrandDto) {
try {
    this.dataSource.manager.update(AddStrand,id,{
    strand_name:updateAddStrandDto.strand_name,
    trackId:updateAddStrandDto.trackId,
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }

//   async updateAttendance( date:string, updateStudentAttendanceDto:UpdateStudentAttendanceDto){
//     let data = JSON.parse(updateStudentAttendanceDto.data)
//     console.log(data, date)
//     try {
//       for (let i = 0; i < data.length; i++) {

//            await  this.dataSource.manager.update(StudentAttendance,{attendanceDate:date,roomID:data[i].roomID,subjectID:data[i].subjectID,studentID:data[i].studentID,school_yearID:data[i].school_yearID },{
//               attendance:data[i].attendance,
//               })
//       }

//   return{
//     msg:'Updated successfully!', status:HttpStatus.OK
//   }
// } catch (error) {
//   return{
//     msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
//   }
// }

//   }
async updateAttendance(date: string, updateStudentAttendanceDto: UpdateStudentAttendanceDto) {
  const data = JSON.parse(updateStudentAttendanceDto.data);
  console.log(data, date);

  try {
    await Promise.all(
      data.map(item =>
        this.dataSource.manager.update(
          StudentAttendance,
          {
            attendanceDate: date,
            roomID: item.roomID,
            subjectID: item.subjectID,
            studentID: item.studentID,
            school_yearID: item.school_yearID
          },
          {
            attendance: item.attendance
          }
        )
      )
    );

    return {
      msg: 'Updated successfully!',
      status: HttpStatus.OK
    };
  } catch (error) {
    return {
      msg: 'Something went wrong! ' + error,
      status: HttpStatus.BAD_REQUEST
    };
  }
} 

async updateStudentGrade(idUser:number, updateStudentGradeDto:UpdateStudentGradeDto) {
  let data = JSON.parse(updateStudentGradeDto.data);
  const quizzes = Object.fromEntries(
    Object.entries(data).filter(([key]) => key.startsWith("Quiz"))
  );
  console.log(idUser,quizzes);
    try {
  for (const [quizLabel, quizData] of Object.entries(quizzes)) {
  const { id, value, max } = quizData as { id:number; value:number; max:number };
  console.log("Quiz:", quizLabel, "ID:", id, "Value:", value, "Max:", max);

    this.dataSource.manager.update(StudentGrade,id,{
      quarterScore:value
      })
    }
    return{
        msg:'Updated successfully!', status:HttpStatus.OK
      }
    } catch (error) {
      return{
        msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
      }
    }
}

    async removeMyStudent(id: number) {
      console.log('ID',id)
    try {
      await this.dataSource.manager.delete(StudentList, id)
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


    async remove(id: number) {
    try {
      await this.subjectRepository.delete(id);
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
