import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateParentRecordDto } from './dto/create-parent-record.dto';
import { UpdateParentRecordDto } from './dto/update-parent-record.dto';
import { AddStrand, AddTracks, EnrollStudent, RoomsSection, SchoolYear, StudentList, UserDetail,StudentAttendance,StudentGrade, TransmutedGrade,StudentQuarterFinalGrade, ParentRecord, Subject, StudentReportDisciplinary } from 'src/entities';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateStudentReportDisciplinaryDto } from './dto/create-student-report-disciplinary.dto';
import { UpdateStudentReportDiscipilinarydDto } from './dto/update-student-report-disciplinary.dto';

@Injectable()
export class ParentRecordsService {
    constructor(private dataSource: DataSource,){}
async  create(createParentRecordDto: CreateParentRecordDto) {

  console.log(createParentRecordDto)
         try {
           let data = this.dataSource.manager.create(ParentRecord,{
             studentID: createParentRecordDto.studentID,
             parentID:createParentRecordDto.parentID,
             school_yearID:createParentRecordDto.school_yearID,
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

  async  studentReport(createStudentReportDisciplinaryDto: CreateStudentReportDisciplinaryDto) {

  // console.log(createStudentReportDisciplinaryDto)
         try {
           let data = this.dataSource.manager.create(StudentReportDisciplinary,{
             studentID: createStudentReportDisciplinaryDto.studentID,
             roomID: createStudentReportDisciplinaryDto.roomID,
             school_yearID: createStudentReportDisciplinaryDto.school_yearID,
             subjectID: createStudentReportDisciplinaryDto.subjectID,
             teacherID: createStudentReportDisciplinaryDto.teacherID,
             report_type: createStudentReportDisciplinaryDto.report_type,
             grade_level: createStudentReportDisciplinaryDto.grade_level,
             report_description: createStudentReportDisciplinaryDto.report_description,
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

  async  findAll() {
      let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(["IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        'ES.id as id',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.seniorJunior as seniorJunior',
        'ES.suffix as suffix',
        'ES.email as email',
        'ES.bdate as bdate',
        'ES.birth_place as birth_place',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.transfered as transfered ',
        'ES.height as height',
        'ES.weight as weight',
        'ES.is_IP as is_IP ',
        'ES.ip_Name as ip_Name',
        'ES.fourPs as fourPs',
        'ES.fourpis as fourpis',
        'ES.disability as disability ',
        'ES.disability_desc as disability_desc',
        'ES.blood_type as blood_type',
        'ES.isFilipino as isFilipino',
        'ES.mobile_no as mobile_no',
        'ES.residential_zip as residential_zip',
        'ES.residential_house_no as residential_house_no',
        'ES.residential_street as residential_street',
        'ES.residential_subd as residential_subd',
        'ES.residential_brgy as residential_brgy',
        'ES.residential_city as residential_city',
        'ES.residential_prov as residential_prov',
        'ES.permanent_zip as permanent_zip',
        'ES.permanent_house_no as permanent_house_no',
        'ES.permanent_street as permanent_street',
        'ES.permanent_subd as permanent_subd',
        'ES.permanent_brgy as permanent_brgy',
        'ES.permanent_city as permanent_city',
        'ES.permanent_prov as permanent_prov',
        'ES.father_fname as father_fname',
        'ES.father_mname as father_mname',
        'ES.father_lname as father_lname',
        'ES.father_number as father_number',
        'ES.mother_fname as mother_fname',
        'ES.mother_mname as mother_mname',
        'ES.mother_lname as mother_lname',
        'ES.mother_number as mother_number',
        'ES.guardian_fname as guardian_fname',
        'ES.guardian_mname as guardian_mname',
        'ES.guardian_lname as guardian_lname',
        'ES.guardian_number as guardian_number',
        'ES.last_grade_completed  as last_grade_completed',
        'ES.last_year_completed  as last_year_completed',
        'ES.last_school_attended  as last_school_attended',
        'ES.last_school_ID  as last_school_ID',
        'ES.track  as track',
        'ES.semester  as track',
        'ES.strand  as track',
        'ES.picture as picture',
        'ES.goodMoral as goodMoral',
        'ES.birthPSA as birthPSA',
        'ES.schoolCard as schoolCard',
        'ES.school_yearId as school_yearId',
        'ES.grade_level as grade_level',
        'ES.updated_at as updated_at',
        'ES.statusEnrolled as statusEnrolled',
      ])
      .leftJoin(ParentRecord, 'PR', 'PR.studentID = ES.id')
      .where('ES.statusEnrolled != 0')
      .andWhere('PR.studentID IS NULL')
      .getRawMany();
      // console.log(data)
      return data
  }

 async getMyChildrenList(curr_user:any){
      let parentID = curr_user.userdetail.id
      let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(["IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        'ES.id as id',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.seniorJunior as seniorJunior',
        'ES.suffix as suffix',
        'ES.email as email',
        'ES.bdate as bdate',
        'ES.birth_place as birth_place',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.transfered as transfered ',
        'ES.height as height',
        'ES.weight as weight',
        'ES.is_IP as is_IP ',
        'ES.ip_Name as ip_Name',
        'ES.fourPs as fourPs',
        'ES.fourpis as fourpis',
        'ES.disability as disability ',
        'ES.disability_desc as disability_desc',
        'ES.blood_type as blood_type',
        'ES.isFilipino as isFilipino',
        'ES.mobile_no as mobile_no',
        'ES.residential_zip as residential_zip',
        'ES.residential_house_no as residential_house_no',
        'ES.residential_street as residential_street',
        'ES.residential_subd as residential_subd',
        'ES.residential_brgy as residential_brgy',
        'ES.residential_city as residential_city',
        'ES.residential_prov as residential_prov',
        'ES.permanent_zip as permanent_zip',
        'ES.permanent_house_no as permanent_house_no',
        'ES.permanent_street as permanent_street',
        'ES.permanent_subd as permanent_subd',
        'ES.permanent_brgy as permanent_brgy',
        'ES.permanent_city as permanent_city',
        'ES.permanent_prov as permanent_prov',
        'ES.father_fname as father_fname',
        'ES.father_mname as father_mname',
        'ES.father_lname as father_lname',
        'ES.father_number as father_number',
        'ES.mother_fname as mother_fname',
        'ES.mother_mname as mother_mname',
        'ES.mother_lname as mother_lname',
        'ES.mother_number as mother_number',
        'ES.guardian_fname as guardian_fname',
        'ES.guardian_mname as guardian_mname',
        'ES.guardian_lname as guardian_lname',
        'ES.guardian_number as guardian_number',
        'ES.last_grade_completed  as last_grade_completed',
        'ES.last_year_completed  as last_year_completed',
        'ES.last_school_attended  as last_school_attended',
        'ES.last_school_ID  as last_school_ID',
        'ES.track  as track',
        'ES.semester  as track',
        'ES.strand  as track',
        'ES.picture as picture',
        'ES.goodMoral as goodMoral',
        'ES.birthPSA as birthPSA',
        'ES.schoolCard as schoolCard',
        'ES.school_yearId as school_yearId',
        'ES.grade_level as grade_level',
        'ES.updated_at as updated_at',
        'ES.statusEnrolled as statusEnrolled',
      ])
      .leftJoin(ParentRecord, 'PR', 'PR.studentID = ES.id')
      .where('ES.statusEnrolled != 0')
      .andWhere('PR.parentID = :parentID', { parentID })
      .getRawMany();
      
      // console.log(data)
      return data
 }
 
 async getDisciplinaryReport(filter:number, tab:number, teacherID:number){
  // console.log(filter,tab,teacherID)

        const data =  this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(["IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as teacher_name",
        'ES.id as id',
        'SRD.id as reportID',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.suffix as suffix',
        'ES.bdate as bdate',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.school_yearId as school_yearId',
        'ES.grade_level as grade_level',
        'ES.statusEnrolled as statusEnrolled',
        'SRD.report_type as report_type',
        'SRD.report_description as report_description',
        'S.subject_title as subject_title',
        'RS.room_section as room_section',
      ])
      .leftJoin(StudentReportDisciplinary, 'SRD', 'SRD.studentID = ES.id')
      .leftJoin(RoomsSection, 'RS', 'RS.id = SRD.roomID')
      .leftJoin(UserDetail, 'UD', 'UD.id = SRD.teacherID')
      .leftJoin(Subject, 'S', 'S.id = SRD.subjectID')
      // .where('ES.statusEnrolled != 0')
      .where('SRD.school_yearID = :filter', { filter })
      .andWhere('RS.teacherId = :teacherID', { teacherID })

      if (tab == 1) {
        data.andWhere("SRD.status = 0")
        data.orderBy('SRD.created_at','DESC')
      } else {
           data.andWhere("SRD.status != 0")
           data.orderBy('SRD.created_at','DESC')
      }
      // .getRawMany();
      const results = await data.getRawMany();
      // console.log(results)
      return results
 }

  async getPrefectReport(filter:number, tab:number, roleID:number){
  console.log(filter,tab,roleID)
        const data =  this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(["IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as teacher_name",
        'ES.id as id',
        'SRD.id as reportID',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.suffix as suffix',
        'ES.bdate as bdate',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.school_yearId as school_yearId',
        'ES.grade_level as grade_level',
        'ES.statusEnrolled as statusEnrolled',
        'SRD.report_type as report_type',
        'SRD.report_description as report_description',
        'S.subject_title as subject_title',
        'RS.room_section as room_section',
      ])
      .leftJoin(StudentReportDisciplinary, 'SRD', 'SRD.studentID = ES.id')
      .leftJoin(RoomsSection, 'RS', 'RS.id = SRD.roomID')
      .leftJoin(UserDetail, 'UD', 'UD.id = SRD.teacherID')
      .leftJoin(Subject, 'S', 'S.id = SRD.subjectID')
      // .where('ES.statusEnrolled != 0')
      .where('SRD.school_yearID = :filter', { filter })

      if (roleID == 6) {
        data.andWhere("SRD.grade_level IN (:...grades)", { grades: ['Grade 7','Grade 8','Grade 9','Grade 10'] });
      } else if (roleID == 7) {
        data.andWhere("SRD.grade_level IN (:...grades)", { grades: ['Grade 11','Grade 12'] });
      }
      if (tab == 1) {
        data.andWhere("SRD.status = 1")
        data.orderBy('SRD.created_at','DESC')
      } else {
           data.andWhere("SRD.status = 2")
           data.orderBy('SRD.created_at','DESC')
      }
      // .getRawMany();
      const results = await data.getRawMany();
      // console.log(results)
      return results
 }

 async getMyChildrenAttendance(studentID:number,school_yearID:number){
        let data = await this.dataSource.manager
      .createQueryBuilder(StudentAttendance, 'SA')
      .select([
        "SA.*",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        "S.subject_title as subject_title",
        
      ])
      .leftJoin(EnrollStudent, 'ES', 'SA.studentID = ES.id')
      .leftJoin(Subject, 'S', 'S.id = SA.subjectID')
      .where('ES.statusEnrolled != 0')
      .andWhere('SA.studentID = :studentID', { studentID })
      .andWhere('SA.school_yearID = :school_yearID', { school_yearID })
      .getRawMany();
      // console.log(data)

        if (!data.length) {
            return []; 
          }
      const dateColumns = data
        .map(
          (d) =>
            `MAX(CASE WHEN a.attendanceDate = '${d.attendanceDate}' THEN a.attendance END) AS \`${d.attendanceDate}\``
        )
        .join(', ');

      const sql = `
        SELECT 
          CONCAT(s.fname, ' ', s.lname) AS student_name,
          subj.subject_title AS subject,
          ${dateColumns}
        FROM student_attendance a
        JOIN enroll_student s ON a.studentID = s.id
        JOIN subject subj ON a.subjectID = subj.id
        WHERE a.studentID = ? 
          AND a.school_yearID = ? 
          AND s.statusEnrolled = 1
        GROUP BY s.id, s.fname, s.lname, subj.subject_title
        ORDER BY student_name, subject
      `;
        // console.log(await this.dataSource.query(sql, [studentID, school_yearID]));
        return this.dataSource.query(sql, [studentID, school_yearID]);
      
 }

 async getMyChildrenGrades(studentID:number,filter:number, gradeLevel:string){

            let query = this.dataSource.manager
              .createQueryBuilder(EnrollStudent, 'ES')
              .select([
                "ES.id as id",
                "IF (!ISNULL(ES.mname) AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ', SUBSTRING(ES.mname, 1, 1), '. ', ES.lname), concat(ES.fname, ' ', ES.lname)) as name",
                "SQF.transmuted_grade as final_grade", 
                "SQF.initial_grade as initial_grade", 
                "SQF.quarter as quarter", 
                "SQF.semester as semester", 
                "S.subject_title as subject_title",
                "SQF.sub_subject as sub_subject"
              ])
              .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
              .leftJoin(StudentQuarterFinalGrade, 'SQF', 'SQF.studentID = ES.id')
              .leftJoin(Subject, 'S', 'S.id = SQF.subjectID')
              .where('SQF.school_yearID = :filter', { filter })
              // .andWhere('SQF.roomID = :roomID', { roomID })
              .andWhere('SQF.studentID = :studentID', { studentID })
              // .andWhere('ES.grade_level = :gradeLevel', { gradeLevel })
              .andWhere('ES.statusEnrolled = 1');
            let newData = await query.getRawMany();
            // console.log(newData)

          let childGrade = await  this.transformChildrenGrade(newData,gradeLevel)
          // console.log(JSON.stringify(childGrade))
          return childGrade
 }

//  async transformChildrenGrade(data:any,gradeLevel:string){
//         let arr
//         let firstSemSubjects
//         let secondSemSubjects
//         let juniorHigh
//         let junior
//         let arrs
//         if(gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'){
//     const pivoted = Object.values(
//   data.reduce((acc, row) => {
//     const { id, name, semester, subject_title, quarter, final_grade } = row;

//     if (!acc[id]) {
//       acc[id] = {
//         id,
//         name,
//         semesters: {}
//       };
//     }

//     // ensure semester bucket exists
//     if (!acc[id].semesters[semester]) {
//       acc[id].semesters[semester] = { subjects: [] };
//     }

//     // find or create subject inside this semester
//     let subject = acc[id].semesters[semester].subjects.find(
//       (s) => s.subject === subject_title
//     );
//     if (!subject) {
//       subject = {
//         subject: subject_title,
//         "1st Quarter": null,
//         "2nd Quarter": null,
//         "3rd Quarter": null,
//         "4th Quarter": null,
//         finalGrade: null,
//         remarks: null
//       };
//       acc[id].semesters[semester].subjects.push(subject);
//     }

//     // assign grade
//     subject[quarter] = final_grade;

//     // recalc
//     const grades = [
//       subject["1st Quarter"],
//       subject["2nd Quarter"],
//       subject["3rd Quarter"],
//       subject["4th Quarter"],
//     ].filter((g) => g !== null);

//     if (grades.length > 0) {
//       const avg = Math.round(
//         grades.reduce((a, b) => a + b, 0) / grades.length
//       );
//       subject.finalGrade = avg;
//       subject.remarks = avg >= 75 ? "Passed" : "Failed";
//     }

//     return acc;
//   }, {})
// );
//     // ensure both semesters exist
//     const arr = JSON.parse(JSON.stringify(pivoted));
//     const arrs = arr[0].semesters;

//         if (!arrs["1st Semester"]) arrs["1st Semester"] = { subjects: [] };
//         if (!arrs["2nd Semester"]) arrs["2nd Semester"] = { subjects: [] };

//         firstSemSubjects = arrs["1st Semester"].subjects;
//         secondSemSubjects = arrs["2nd Semester"].subjects;
//           return {
//             firstSem: firstSemSubjects || [],
//             secondSem: secondSemSubjects || []
//           };
        
//             }else{
//         const pivoted = Object.values(
//           data.reduce((acc, row) => {
//             const { id, name, semester, subject_title, quarter, final_grade, sub_subject } = row;

//             if (!acc[id]) {
//               acc[id] = { id, name, semesters: {} };
//             }

//             if (!acc[id].semesters[semester]) {
//               acc[id].semesters[semester] = { subjects: [] };
//             }

//             const sem = acc[id].semesters[semester];

//             if (sub_subject) {
//               const subSubjects = JSON.parse(sub_subject);
//               const subGrades: number[] = [];

//               Object.keys(subSubjects).forEach(sub => {
//                 let subItem = sem.subjects.find(s => s.subject === sub);
//                 if (!subItem) {
//                   subItem = {
//                     subject: sub,
//                     '1st Quarter': null,
//                     '2nd Quarter': null,
//                     '3rd Quarter': null,
//                     '4th Quarter': null,
//                     finalGrade: null,
//                     conspan:null,
//                     remarks: null
//                   };
//                   sem.subjects.push(subItem);
//                 }

//                 subItem[quarter] = subSubjects[sub].transmuted_grade;
//                 subGrades.push(subSubjects[sub].transmuted_grade);
//               });

            
//               let mapeh = sem.subjects.find(s => s.subject === subject_title);
//               if (!mapeh) {
//                 mapeh = {
//                   subject: subject_title, // "MAPEH"
//                   '1st Quarter': null,
//                   '2nd Quarter': null,
//                   '3rd Quarter': null,
//                   '4th Quarter': null,
//                   finalGrade: null,
//                   conspan:null,
//                   remarks: null
//                 };
//                 sem.subjects.push(mapeh);
//               }

              
//               if (subGrades.length > 0) {
//                 const quarterAvg = Math.round(subGrades.reduce((a, b) => a + b, 0) / subGrades.length);
//                 mapeh[quarter] = quarterAvg;
//               }

             
//               const mapehGrades = [
//                 mapeh['1st Quarter'],
//                 mapeh['2nd Quarter'],
//                 mapeh['3rd Quarter'],
//                 mapeh['4th Quarter'],
//               ].filter(g => g !== null);

//               if (mapehGrades.length > 0) {
//                 const avg = Math.round(mapehGrades.reduce((a, b) => a + b, 0) / mapehGrades.length);
//                 mapeh.finalGrade = avg;
//                 mapeh.remarks = avg >= 75 ? "Passed" : "Failed";
//               }

//             } else {
//               let subject = sem.subjects.find(s => s.subject === subject_title);
//               if (!subject) {
//                 subject = {
//                   subject: subject_title,
//                   '1st Quarter': null,
//                   '2nd Quarter': null,
//                   '3rd Quarter': null,
//                   '4th Quarter': null,
//                   finalGrade: null,
//                   conspan:1,
//                   remarks: null
//                 };
//                 sem.subjects.push(subject);
//               }

//               subject[quarter] = final_grade;

//               const grades = [
//                 subject['1st Quarter'],
//                 subject['2nd Quarter'],
//                 subject['3rd Quarter'],
//                 subject['4th Quarter'],
//               ].filter(g => g !== null);

//               if (grades.length > 0) {
//                 const avg = Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
//                 subject.finalGrade = avg;
//                 subject.remarks = avg >= 75 ? "Passed" : "Failed";
//               }
//             }

//             return acc;
//           }, {})
//         );

//         arr = JSON.parse(JSON.stringify(pivoted));
//         arrs = arr[0].semesters;

//         Object.keys(arrs).forEach(semKey => {
//           let semSubjects = arrs[semKey].subjects;

//           const normalSubjects = semSubjects.filter(s => s.subject !== "MAPEH" && !["Music","Arts","Physical Education","Health"].includes(s.subject));
//           const mapeh = semSubjects.find(s => s.subject === "MAPEH");
//           const subs = semSubjects.filter(s => ["Music","Arts","Physical Education","Health"].includes(s.subject));

//           const generalGrades = [...normalSubjects, mapeh].filter(Boolean).map(s => s.finalGrade).filter(g => g !== null);
//           let generalAverage = null;
//           if (generalGrades.length > 0) {
//             generalAverage = Math.round(generalGrades.reduce((a,b) => a+b,0) / generalGrades.length);
//           }

//         arrs[semKey].subjects = [
//           ...normalSubjects,
//           mapeh,
//           ...subs,
//           {
//             subject: "General Average",
//             conspan:5,
//             finalGrade: generalAverage,
//             remarks: generalAverage >= 75 ? "Passed" : "Failed"
//           }
//         ];
//       });

//         if (arrs["Junior High"]) {
//     return { juniorHigh: arrs["Junior High"].subjects };
//   } else {
//     return { juniorHigh: [] }; // fallback safe return
//   }
//           }

//  }
async transformChildrenGrade(data:any, gradeLevel:string){
  if (gradeLevel === "Grade 11" || gradeLevel === "Grade 12") {
    // ----- Senior High -----
    const pivoted = Object.values(
      data.reduce((acc, row) => {
        const { id, name, semester, subject_title, quarter, final_grade } = row;

        if (!acc[id]) acc[id] = { id, name, semesters: {} };
        if (!acc[id].semesters[semester]) acc[id].semesters[semester] = { subjects: [] };

        const sem = acc[id].semesters[semester];

        let subject = sem.subjects.find(s => s.subject === subject_title);
        if (!subject) {
          subject = {
            subject: subject_title,
            "1st Quarter": null,
            "2nd Quarter": null,
            finalGrade: null,
            remarks: null
          };
          sem.subjects.push(subject);
        }

        subject[quarter] = final_grade;

        const grades = [subject["1st Quarter"], subject["2nd Quarter"]].filter(g => g !== null);
        if (grades.length) {
          const avg = Math.round(grades.reduce((a,b)=>a+b,0)/grades.length);
          subject.finalGrade = avg;
          subject.remarks = avg >= 75 ? "Passed" : "Failed";
        }

        return acc;
      }, {})
    );

    const arr = JSON.parse(JSON.stringify(pivoted));
    const arrs = arr[0].semesters;

    return {
      seniorHigh: {
        firstSem: arrs["1st Semester"]?.subjects || [],
        secondSem: arrs["2nd Semester"]?.subjects || []
      }
    };

  } else {
    // ----- Junior High -----
    const pivoted = Object.values(
      data.reduce((acc, row) => {
        const { id, name, semester, subject_title, quarter, final_grade, sub_subject } = row;

        if (!acc[id]) acc[id] = { id, name, semesters: {} };
        if (!acc[id].semesters[semester]) acc[id].semesters[semester] = { subjects: [] };

        const sem = acc[id].semesters[semester];

        if (sub_subject) {
          const subSubjects = JSON.parse(sub_subject);
          const subGrades: number[] = [];

          Object.keys(subSubjects).forEach(sub => {
            let subItem = sem.subjects.find(s => s.subject === sub);
            if (!subItem) {
              subItem = { subject: sub, "1st Quarter": null, "2nd Quarter": null, "3rd Quarter": null, "4th Quarter": null, finalGrade: null, remarks: null };
              sem.subjects.push(subItem);
            }
            subItem[quarter] = subSubjects[sub].transmuted_grade;
            subGrades.push(subSubjects[sub].transmuted_grade);
          });

          let mapeh = sem.subjects.find(s => s.subject === "MAPEH");
          if (!mapeh) {
            mapeh = { subject: "MAPEH", "1st Quarter": null, "2nd Quarter": null, "3rd Quarter": null, "4th Quarter": null, finalGrade: null, remarks: null };
            sem.subjects.push(mapeh);
          }

          if (subGrades.length > 0) {
            const quarterAvg = Math.round(subGrades.reduce((a,b)=>a+b,0)/subGrades.length);
            mapeh[quarter] = quarterAvg;
          }

          const mapehGrades = [mapeh["1st Quarter"], mapeh["2nd Quarter"], mapeh["3rd Quarter"], mapeh["4th Quarter"]].filter(g => g !== null);
          if (mapehGrades.length) {
            const avg = Math.round(mapehGrades.reduce((a,b)=>a+b,0)/mapehGrades.length);
            mapeh.finalGrade = avg;
            mapeh.remarks = avg >= 75 ? "Passed" : "Failed";
          }

        } else {
          let subject = sem.subjects.find(s => s.subject === subject_title);
          if (!subject) {
            subject = { subject: subject_title, "1st Quarter": null, "2nd Quarter": null, "3rd Quarter": null, "4th Quarter": null, finalGrade: null, remarks: null };
            sem.subjects.push(subject);
          }

          subject[quarter] = final_grade;

          const grades = [subject["1st Quarter"], subject["2nd Quarter"], subject["3rd Quarter"], subject["4th Quarter"]].filter(g => g !== null);
          if (grades.length) {
            const avg = Math.round(grades.reduce((a,b)=>a+b,0)/grades.length);
            subject.finalGrade = avg;
            subject.remarks = avg >= 75 ? "Passed" : "Failed";
          }
        }

        return acc;
      }, {})
    );

    const arr = JSON.parse(JSON.stringify(pivoted));
    const arrs = arr[0].semesters;

    return { juniorHigh: arrs["Junior High"]?.subjects || [] };
  }
}

 

  findOne(id: number) {
    return `This action returns a #${id} parentRecord`;
  }

  update(id: number, updateParentRecordDto: UpdateParentRecordDto) {
    return `This action updates a #${id} parentRecord`;
  }

   updateStudentReport(id:number,updateStudentReportDiscipilinarydDto:UpdateStudentReportDiscipilinarydDto){
      try {
        this.dataSource.manager.update(StudentReportDisciplinary, id,{
          status:updateStudentReportDiscipilinarydDto.status,
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

  remove(id: number) {
    return `This action removes a #${id} parentRecord`;
  }
}
