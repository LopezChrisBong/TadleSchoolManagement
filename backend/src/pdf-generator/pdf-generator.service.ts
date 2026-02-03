import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';
import { format } from 'date-fns';
import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  AddStrand,
  AddTracks,
  Availability,
  EnrollStudent,
  RoomsSection,
  SchoolYear,
  StudentList,
  StudentQuarterFinalGrade,
  Subject,
  TeacherSubject,
  UserDetail,
  Users,
} from 'src/entities';
import { join } from 'path';
import { log } from 'console';
// import { scale } from 'pdfkit';
// import {
//   computeTotal,
//   formatActualAccompishment,
//   formatSuccessIndicator,
//   getTotal,
//   loadSummaryHeader,
// } from 'src/ipcr-target/shared-function';
// import newFs
const hbs = require('handlebars');
// const QRCode = require('qrcode');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const moment = require('moment');
const fs1 = require('fs');

hbs.registerHelper('eq', (a, b) => a === b);

hbs.registerHelper('dateFormat', function (value) {
  if (value) {
    return moment(value).format('MM/DD/YYYY');
  }
  return;
});

hbs.registerHelper('formatTime', function (time, format = 'h:mm a') {
  if (time) {
    return moment(time).format(format);
  }
  return;
});

hbs.registerHelper('formatAlphanumericDate', function (value) {
  if (value) {
    return moment(value).format('MMMM DD, YYYY');
  }
  return;
});

hbs.registerHelper('toUpperCase', function (value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return;
});

hbs.registerHelper('concatenate', function (value, value1) {
  return value + '/' + value1;
});

hbs.registerHelper('formatAmount', function (value) {
  const val = (value / 1).toFixed(2).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

hbs.registerHelper('getAnnual', function (value) {
  var annual = 0;
  for (let i = 0; i < 12; i++) {
    annual += parseFloat(value);
  }
  return annual;
});

hbs.registerHelper('curDate', function (formattype) {
  if (formattype == 'numeric') {
    return moment().format('MM/DD/YYYY');
  } else if (formattype == 'alphanumeric') {
    return moment().format('MMMM DD, YYYY');
  }
});

hbs.registerHelper('getPresentDate', function () {
  return moment().format('MM/DD/YY');
});

hbs.registerHelper('formatDate', function (value) {
  return moment(value).format('MM/DD/YY');
});

hbs.registerHelper('sexFormat', function (value) {
  if (value) {
    if (value.toLowerCase() == 'male') {
      return 'M';
    } else if (value.toLowerCase() == 'female') {
      return 'F';
    }
  }
});

hbs.registerHelper('for', function (from, to, incr, block) {
  var accum = '';
  for (var i = from; i < to; i += incr) accum += block.fn(i);
  return accum;
});

hbs.registerHelper('JSONParse', function (value) {
  return JSON.parse(value);
});

hbs.registerHelper('calcAge', function (value) {
  var dob = new Date(value);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

hbs.registerHelper('ifEqual', function (value, conditionVal) {
  return value == conditionVal ? true : false;
});

hbs.registerHelper('formatValueIfNotIsNaN', function (value) {
  if (isNaN(value)) {
    return value;
  } else {
    const val = (value / 1).toFixed(2).replace(',', '.');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

hbs.registerHelper('tableDateFormat', function (value) {
  const date = new Date(value);
  const mnthsArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = date.getDate();
  const month = mnthsArr[date.getMonth()];
  const yr = date.getFullYear();
  return d + '-' + month + '-' + yr.toString().substring(2);
});

hbs.registerHelper('getCurrentMonth', function () {
  const date = new Date();
  const mnthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = mnthsArr[date.getMonth()];

  return month;
});

hbs.registerHelper('getCurrentYear', function () {
  const date = new Date();
  const yr = date.getFullYear();

  return yr;
});

hbs.registerHelper('getPrevYear', function () {
  const date = new Date();
  const yr = date.getFullYear() - 1;

  return yr;
});

hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getObject', function (arr, index) {
  return arr[index];
});

hbs.registerHelper('getValue', function (arr, data) {
  return arr.data;
});

hbs.registerHelper('ifAns', function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCount', function (v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNull', function (v1, options) {
  if (v1 != null) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNullAndNotNAandNotEmpty', function (v1, options) {
  if (
    v1 != null &&
    v1.toString().replace(/\s/g, '').replace(/\t/g, '').toLowerCase() !=
      'n/a' &&
    v1 != ' ' &&
    v1 != ''
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatName', function (fname, mname, lname) {
  if (mname) {
    return fname + ' ' + mname[0] + '. ' + lname;
  } else {
    return fname + ' ' + lname;
  }
});

hbs.registerHelper('toTitleCase', function (val) {
  return val.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
});

hbs.registerHelper('getCount', function (val) {
  return val.length;
});

hbs.registerHelper('hasData', function (v1, v2, options) {
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getPercentage', function (val, totalVal) {
  let percentage = (val / totalVal) * 100;
  return percentage.toFixed(2);
});

hbs.registerHelper('formatGovIDDateIssued', function (val) {
  if (val) {
    let dump = val.split('/');
    let str;
    let str1;
    let str2;
    str1 = dump[0] == null || dump[0] == 'null' ? null : dump[0];
    str2 = dump[1] == null || dump[1] == 'null' ? null : dump[1];
    if (str1 && str2) {
      str = str1 + '/' + str2;
    } else if (str1 && !str2) {
      str = str1;
    } else if (!str1 && str2) {
      str = str2;
    } else if (!str1 && !str2) {
      str = 'N/A';
    }
    return str;
  } else {
    return 'N/A';
  }
});

hbs.registerHelper('math', function (lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    '+': lvalue + rvalue,
  }[operator];
});
hbs.registerHelper('divide', function (a, b) {
  return (a / b).toFixed(2);
});

@Injectable()
export class PdfGeneratorService {
  constructor(private dataSource: DataSource) {}

  async compile(templatename, data) {
    // //development
    //   process.cwd(),
    //   'src/pdf-generator/templates',
    //   `${templatename}.hbs`,
    // );

    //hosted filepath for pdf

    const filepath = path.join(
      __dirname,
      '../pdf-generator/templates',
      `${templatename}.hbs`,
    );

    const html = await fs.readFile(filepath, 'utf-8');
    return hbs.compile(html)(data);
  }

  base64_encode(file, type) {
    // read binary data
    var bitmap;
    if (type == 'profile') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        bitmap = fs.readFileSync(
          join(
            process.cwd(),
            process.env.FILE_PATH + 'upload_img/img_avatar.png',
          ),
        );
      }
    } else if (type == 'headerfooter') {
      bitmap = fs.readFileSync(file);
    } else if (type == 'esig') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        return;
      }
    }

    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }
  getFirstDate(data: any) {
    let dump = JSON.parse(data);
    return dump[0];
  }

  isValidJSON(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  formatDate(value) {
    return moment(value).format('MMM DD,YYYY');
  }

  async getMySchedule(facultyId: number, filter: number) {
    console.log(facultyId, filter);
    let mySched = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        'A.id as id',
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('', sub.subject_title, ',', room.room_section) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('', sub.subject_title, ',',  room.room_section) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT(' ', sub.subject_title, ',',  room.room_section) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('', sub.subject_title, ',',  room.room_section) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('', sub.subject_title, ',',  room.room_section) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('', sub.subject_title, ',',  room.room_section) END) AS Saturday",
      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      .where('A.teacherID = "' + facultyId + '"')
      .andWhere('A.school_yearId = "' + filter + '"')
      .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
      .orderBy('A.times_slot_from')
      .getRawMany();

    let teacherName = mySched[0].name;

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/header.png',
    );
    let footerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/footer.png',
    );
    // let headerImg = join(process.cwd(), '/../static/img/header.png');
    // let footerImg = join(process.cwd(), '/../static/img/footer.png');

    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        mySched: mySched,
        year: filter,
        teacherName: teacherName,
        // month:getmonth
      },
    ];

    // console.log(data);
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('my-sched', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async getStudentAchievements(
    studentID: number,
    roomID: number,
    filter: number,
    gradeLevel: string,
  ) {
    // console.log(studentID, roomID, filter,gradeLevel)
    let arr;
    let firstSemSubjects;
    let secondSemSubjects;
    let juniorHigh;
    let arrs;
    let junior;
    let query = this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        'ES.id as id',
        "IF (!ISNULL(ES.mname) AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ', SUBSTRING(ES.mname, 1, 1), '. ', ES.lname), concat(ES.fname, ' ', ES.lname)) as name",
        'SQF.transmuted_grade as final_grade',
        'SQF.initial_grade as initial_grade',
        'SQF.quarter as quarter',
        'SQF.semester as semester',
        'S.subject_title as subject_title',
        'SQF.sub_subject as sub_subject',
      ])
      .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
      .leftJoin(StudentQuarterFinalGrade, 'SQF', 'SQF.studentID = ES.id')
      .leftJoin(Subject, 'S', 'S.id = SQF.subjectID')
      .where('SQF.school_yearID = :filter', { filter })
      .andWhere('SQF.roomID = :roomID', { roomID })
      .andWhere('SQF.studentID = :studentID', { studentID })
      .andWhere('ES.grade_level = :gradeLevel', { gradeLevel })
      .andWhere('ES.statusEnrolled = 1');
    let newData = await query.getRawMany();

    // console.log(newData)
    if (gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12') {
      const pivoted = Object.values(
        newData.reduce((acc, row) => {
          const { id, name, semester, subject_title, quarter, final_grade } =
            row;

          if (!acc[id]) {
            acc[id] = {
              id,
              name,
              semesters: {},
            };
          }

          // ensure semester bucket exists
          if (!acc[id].semesters[semester]) {
            acc[id].semesters[semester] = { subjects: [] };
          }

          // find or create subject inside this semester
          let subject = acc[id].semesters[semester].subjects.find(
            (s) => s.subject === subject_title,
          );
          if (!subject) {
            subject = {
              subject: subject_title,
              '1st Quarter': null,
              '2nd Quarter': null,
              '3rd Quarter': null,
              '4th Quarter': null,
              finalGrade: null,
              remarks: null,
            };
            acc[id].semesters[semester].subjects.push(subject);
          }

          // assign the grade under the correct quarter
          subject[quarter] = final_grade;

          // recalc final grade
          const grades = [
            subject['1st Quarter'],
            subject['2nd Quarter'],
            subject['3rd Quarter'],
            subject['4th Quarter'],
          ].filter((g) => g !== null);

          if (grades.length > 0) {
            const avg = Math.round(
              grades.reduce((a, b) => a + b, 0) / grades.length,
            );
            subject.finalGrade = avg;
            subject.remarks = avg >= 75 ? 'Passed' : 'Failed';
          }

          return acc;
        }, {}),
      );

      arr = JSON.parse(JSON.stringify(pivoted));
      arrs = arr[0].semesters;
      firstSemSubjects = arrs['1st Semester'].subjects;
      secondSemSubjects = arrs['2nd Semester'].subjects;
      // console.log('Second',secondSemSubjects)
    } else {
      const pivoted = Object.values(
        newData.reduce((acc, row) => {
          const {
            id,
            name,
            semester,
            subject_title,
            quarter,
            final_grade,
            sub_subject,
          } = row;

          if (!acc[id]) {
            acc[id] = { id, name, semesters: {} };
          }

          if (!acc[id].semesters[semester]) {
            acc[id].semesters[semester] = { subjects: [] };
          }

          const sem = acc[id].semesters[semester];

          if (sub_subject) {
            const subSubjects = JSON.parse(sub_subject);
            const subGrades: number[] = [];

            Object.keys(subSubjects).forEach((sub) => {
              let subItem = sem.subjects.find((s) => s.subject === sub);
              if (!subItem) {
                subItem = {
                  subject: sub,
                  '1st Quarter': null,
                  '2nd Quarter': null,
                  '3rd Quarter': null,
                  '4th Quarter': null,
                  finalGrade: null,
                  conspan: null,
                  remarks: null,
                };
                sem.subjects.push(subItem);
              }

              subItem[quarter] = subSubjects[sub].transmuted_grade;
              subGrades.push(subSubjects[sub].transmuted_grade);
            });

            let mapeh = sem.subjects.find((s) => s.subject === subject_title);
            if (!mapeh) {
              mapeh = {
                subject: subject_title, // "MAPEH"
                '1st Quarter': null,
                '2nd Quarter': null,
                '3rd Quarter': null,
                '4th Quarter': null,
                finalGrade: null,
                conspan: null,
                remarks: null,
              };
              sem.subjects.push(mapeh);
            }

            if (subGrades.length > 0) {
              const quarterAvg = Math.round(
                subGrades.reduce((a, b) => a + b, 0) / subGrades.length,
              );
              mapeh[quarter] = quarterAvg;
            }

            const mapehGrades = [
              mapeh['1st Quarter'],
              mapeh['2nd Quarter'],
              mapeh['3rd Quarter'],
              mapeh['4th Quarter'],
            ].filter((g) => g !== null);

            if (mapehGrades.length > 0) {
              const avg = Math.round(
                mapehGrades.reduce((a, b) => a + b, 0) / mapehGrades.length,
              );
              mapeh.finalGrade = avg;
              mapeh.remarks = avg >= 75 ? 'Passed' : 'Failed';
            }
          } else {
            let subject = sem.subjects.find((s) => s.subject === subject_title);
            if (!subject) {
              subject = {
                subject: subject_title,
                '1st Quarter': null,
                '2nd Quarter': null,
                '3rd Quarter': null,
                '4th Quarter': null,
                finalGrade: null,
                conspan: 1,
                remarks: null,
              };
              sem.subjects.push(subject);
            }

            subject[quarter] = final_grade;

            const grades = [
              subject['1st Quarter'],
              subject['2nd Quarter'],
              subject['3rd Quarter'],
              subject['4th Quarter'],
            ].filter((g) => g !== null);

            if (grades.length > 0) {
              const avg = Math.round(
                grades.reduce((a, b) => a + b, 0) / grades.length,
              );
              subject.finalGrade = avg;
              subject.remarks = avg >= 75 ? 'Passed' : 'Failed';
            }
          }

          return acc;
        }, {}),
      );

      arr = JSON.parse(JSON.stringify(pivoted));
      arrs = arr[0].semesters;

      Object.keys(arrs).forEach((semKey) => {
        let semSubjects = arrs[semKey].subjects;

        const normalSubjects = semSubjects.filter(
          (s) =>
            s.subject !== 'MAPEH' &&
            !['Music', 'Arts', 'Physical Education', 'Health'].includes(
              s.subject,
            ),
        );
        const mapeh = semSubjects.find((s) => s.subject === 'MAPEH');
        const subs = semSubjects.filter((s) =>
          ['Music', 'Arts', 'Physical Education', 'Health'].includes(s.subject),
        );

        const generalGrades = [...normalSubjects, mapeh]
          .filter(Boolean)
          .map((s) => s.finalGrade)
          .filter((g) => g !== null);
        let generalAverage = null;
        if (generalGrades.length > 0) {
          generalAverage = Math.round(
            generalGrades.reduce((a, b) => a + b, 0) / generalGrades.length,
          );
        }

        arrs[semKey].subjects = [
          ...normalSubjects,
          mapeh,
          ...subs,
          {
            subject: 'General Average',
            conspan: 5,
            finalGrade: generalAverage,
            remarks: generalAverage >= 75 ? 'Passed' : 'Failed',
          },
        ];
      });

      juniorHigh = arrs['Junior High'].subjects;
    }

    let studentData = {};
    if (arrs['Junior High']) {
      junior = true;
      studentData = { juniorHigh: juniorHigh };
    } else {
      junior = false;
      studentData = {
        firstSem: firstSemSubjects,
        secondSem: secondSemSubjects,
      };
    }
    console.log(studentData);

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/header.png',
    );
    let footerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/footer.png',
    );
    // let headerImg = join(process.cwd(), '/../static/img/header.png');
    // let footerImg = join(process.cwd(), '/../static/img/footer.png');
    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        student: arr[0],
        gradeLevel: gradeLevel,
        studentData: studentData,
        junior: junior,
        // name:gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'? arr[0].name: arr.name,
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('students-achievement', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllStudentsFinalGrade(
    filter: number,
    roomID: number,
    quarter: string,
    semester: string,
    gradeLevel: string,
  ) {
    let query = this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        'ES.id as id',
        "IF (!ISNULL(ES.mname) AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ', SUBSTRING(ES.mname, 1, 1), '. ', ES.lname), concat(ES.fname, ' ', ES.lname)) as name",
        'SQF.transmuted_grade as final_grade',
        'SQF.initial_grade as initial_grade',
        'SQF.quarter as quarter',
        'SQF.semester as semester',
        'S.subject_title as subject_title',
      ])
      .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
      .leftJoin(StudentQuarterFinalGrade, 'SQF', 'SQF.studentID = ES.id')
      .leftJoin(Subject, 'S', 'S.id = SQF.subjectID')
      .where('SQF.school_yearID = :filter', { filter })
      .andWhere('SQF.roomID = :roomID', { roomID })
      .andWhere('SQF.semester = :semester', { semester })
      .andWhere('ES.statusEnrolled = 1');

    let rawData = await query.getRawMany();
    const newrawData = await this.transformData(rawData);
    console.log(newrawData.students);

    let roomQuery = this.dataSource.manager
      .createQueryBuilder(RoomsSection, 'RS')
      .select([
        'UD.id as id',
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), '. ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
        'RS.room_section as section_name',
      ])
      .leftJoin(UserDetail, 'UD', 'UD.id = RS.teacherId')
      .where('RS.id = :roomID', { roomID })
      .andWhere('RS.grade_level = :gradeLevel', { gradeLevel });

    let roomData = await roomQuery.getRawMany();
    // console.log(roomData);

    let colapse;
    if (semester == 'Junior High') {
      colapse = false;
    } else {
      colapse = true;
    }

    let schoolYear = await this.dataSource.manager
      .createQueryBuilder(SchoolYear, 'A')
      .select([
        // "*",
        "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
        // "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate"
      ])
      .where('A.status = 1')
      .getRawOne();

    // console.log(schoolYear.school_year)

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/header.png',
    );
    let footerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/footer.png',
    );

    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        data: newrawData,
        roomData: roomData[0],
        gradeLevel: gradeLevel,
        semester: semester,
        colapse: colapse,
        schoolYear: schoolYear.school_year,
        // name:gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'? arr[0].name: arr.name,
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('student-all-grade', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: true,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async transformData(rawData: any) {
    const students: Record<number, any> = {};
    const subjectsSet = new Set<string>();

    rawData.forEach((row) => {
      const { id, name, subject_title, final_grade, quarter } = row;

      if (!students[id]) {
        students[id] = {
          id,
          name,
          finalAverage: 0,
          status: '',
        };
      }

      if (!students[id][subject_title]) {
        students[id][subject_title] = {
          q1: null,
          q2: null,
          q3: null,
          q4: null,
          final: null,
        };
      }

      // Track dynamic subjects
      subjectsSet.add(subject_title);

      // Assign grades by quarter
      if (quarter === '1st Quarter')
        students[id][subject_title].q1 = final_grade;
      else if (quarter === '2nd Quarter')
        students[id][subject_title].q2 = final_grade;
      else if (quarter === '3rd Quarter')
        students[id][subject_title].q3 = final_grade;
      else if (quarter === '4th Quarter')
        students[id][subject_title].q4 = final_grade;

      // Compute subject final
      const { q1, q2, q3, q4 } = students[id][subject_title];
      const quarters = [q1, q2, q3, q4].filter((q) => q != null);

      if (quarters.length > 0) {
        students[id][subject_title].final = Math.round(
          quarters.reduce((a, b) => a + b, 0) / quarters.length,
        );
      }
    });

    // Compute student’s overall final average
    Object.values(students).forEach((student: any) => {
      const subjectFinals = Object.keys(student)
        .filter(
          (key) => !['id', 'name', 'finalAverage', 'status'].includes(key),
        )
        .map((subject) => student[subject].final)
        .filter((f) => f != null);

      if (subjectFinals.length > 0) {
        student.finalAverage = Math.round(
          subjectFinals.reduce((a, b) => a + b, 0) / subjectFinals.length,
        );
        student.status = student.finalAverage >= 75 ? 'Passed' : 'Failed';
      }
    });

    return {
      subjects: Array.from(subjectsSet), // return subjects separately
      students: Object.values(students),
    };
  }

  async getAllUnderLoadFaculty(filter: number) {
    let query = this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        'A.*',
        'A.id as id',
        'UD.education as education',
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), '. ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
      ])
      .leftJoin(Availability, 'A', 'A.teacherID = UD.id')
      .where('A.school_yearId = :filter', { filter });
    let rawData = await query.getRawMany();
    // console.log(rawData)
    let load = [];
    rawData.forEach((hours) => {
      const obj = load.find((teacher) => teacher.teacherID === hours.teacherID);
      if (obj) {
        obj.hours = Number(obj.hours) + Number(hours.hours);
      } else {
        load.push(hours);
      }
    });
    for (let i = 0; i < load.length; i++) {
      let loadedHour = Number(load[i].hours) - 40;
      // let loadedHour = 40 - 40
      if (loadedHour > 0) {
        Object.assign(load[i], { overload: loadedHour });
      } else {
        let data = loadedHour * -1;
        Object.assign(load[i], { underload: data });
      }
    }
    // console.log(load)

    let newLoader = [];
    for (let i = 0; i < load.length; i++) {
      if (load[i].underload != -0) {
        newLoader.push(load[i]);
      }
    }
    // console.log(newLoader)

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/header.png',
    );
    let footerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/footer.png',
    );
    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        load: newLoader,
        // name:gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'? arr[0].name: arr.name,
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('underload-faculty', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async getSchoolForm2(
    school_yearID: number,
    roomID: number,
    subjectID: number,
    attendanceDate: string,
    teacherID: number,
  ) {
    // console.log(filter,roomID,subjectID,date)
    let attendance;
    let rawData;
    let month;
    if (attendanceDate == '1') {
      month = 'January';
    } else if (attendanceDate == '2') {
      month = 'February';
    } else if (attendanceDate == '3') {
      month = 'March';
    } else if (attendanceDate == '4') {
      month = 'April';
    } else if (attendanceDate == '5') {
      month = 'May';
    } else if (attendanceDate == '6') {
      month = 'June';
    } else if (attendanceDate == '7') {
      month = 'July';
    } else if (attendanceDate == '8') {
      month = 'August';
    } else if (attendanceDate == '9') {
      month = 'September';
    } else if (attendanceDate == '10') {
      month = 'October';
    } else if (attendanceDate == '11') {
      month = 'November';
    } else if (attendanceDate == '12') {
      month = 'December';
    }

    let teacherData = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'RS.room_section as room_section',
        'RS.grade_level as grade_level',
      ])
      .leftJoin(RoomsSection, 'RS', 'RS.teacherID = UD.id')
      .where('UD.id = :teacherID', { teacherID })
      .andWhere('RS.id = :roomID', { roomID })
      .getRawOne();

    let schoolYear = await this.dataSource.manager
      .createQueryBuilder(SchoolYear, 'SY')
      .select([
        // "*",
        "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
        "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate",
      ])
      .where('SY.id = :school_yearID', { school_yearID })
      .getRawOne();

    // console.log(schoolYear)
    const dates = await this.dataSource.query(
      `
        SELECT DISTINCT attendanceDate
        FROM student_attendance
        WHERE roomID = ? AND subjectID = ? AND school_yearID = ?
        ORDER BY attendanceDate
        `,
      [roomID, subjectID, school_yearID],
    );

    if (!dates.length) {
      attendance = false;
    } else {
      attendance = true;
      const dateColumns = dates
        .map(
          (d) =>
            `MAX(CASE WHEN a.attendanceDate = '${d.attendanceDate}' THEN a.attendance END) AS \`${d.attendanceDate}\``,
        )
        .join(', ');
      const sql = `
          SELECT 
            CONCAT(s.lname, ' ', s.fname) AS student_name,
            ${dateColumns}
          FROM student_attendance a
          JOIN enroll_student s ON a.studentID = s.id
          WHERE a.roomID = ? AND a.subjectID = ? AND a.school_yearID = ? AND MONTH(a.attendanceDate) = ?  AND s.statusEnrolled = 1
          GROUP BY s.id, s.fname, s.lname
          ORDER BY student_name
        `;
      rawData = await this.dataSource.query(sql, [
        roomID,
        subjectID,
        school_yearID,
        attendanceDate,
      ]);
    }
    //  console.log(attendance)

    let newData;
    let updatedRow;
    if (attendance === true) {
      newData = await this.transformSchoolForm2(rawData, month);
      updatedRow = newData.rows.map((row) => {
        return row.map((val, idx) => {
          // First column is student_name, last two are absent/tardy counters → keep them as-is
          if (idx === 0 || idx >= row.length - 2) return val;
          if (val === '0') return '✖';
          if (val === '3') return '▨';
          if (val === '2') return '◻';
          if (val) return '✔';
          return '';
        });
      });
      console.log(updatedRow);
    }

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/edukasyon.png',
    );
    // let footerImg = join(process.cwd(), '/static/img/footer.png');
    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        // footer_img: this.base64_encode(footerImg, 'headerfooter'),
        schoolYear: schoolYear,
        teacherData: teacherData,
        rawData: newData,
        updatedRow: updatedRow,
        month: month,
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('school-form2', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: true,
        printBackground: true,
      });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }
  // async transformSchoolForm2(data:any){
  //   // console.log(data)
  //   // Step 1: collect all unique dates
  //   const allDates = [...new Set(
  //     data.flatMap(d => Object.keys(d).filter(k => k !== "student_name"))
  //   )].sort();

  //   // Step 2: create header row
  //   const headers = ["Learner's Name", ...allDates, "Absent", "Tardy"];

  //   // Step 3: build rows
  // const rows = data.map((d: Record<string, any>) => {
  //   const row: (string | number)[] = [d.student_name];
  //   let absent = 0, tardy = 0;

  //   allDates.forEach((date: string) => {
  //     const val = d[date] ?? ""; // ✅ no error now
  //     row.push(val);

  //     if (val === "0") absent++;
  //     if (val === "2") tardy++;
  //     // if (val === "3") tardy++;
  //   });

  //   row.push(absent, tardy);
  //   return row;
  // });

  //   return { headers, rows };
  // }
  async transformSchoolForm2(data: any[], selectedMonth: string) {
    // Step 1: Collect all unique dates
    const allDates = [
      ...new Set(
        data.flatMap((d) => Object.keys(d).filter((k) => k !== 'student_name')),
      ),
    ].sort();

    // Step 2: Group dates by month (include *all days* of the selected month only)
    const months: Record<string, number[]> = {};
    allDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const month = date.getMonth();

      if (monthName === selectedMonth) {
        // compute total days of this month
        const totalDays = new Date(year, month + 1, 0).getDate();

        if (!months[monthName]) {
          months[monthName] = Array.from(
            { length: totalDays },
            (_, i) => i + 1,
          );
        }
      }
    });

    // Step 3: Build headers
    const headers = [
      { type: 'fixed', label: "Learner's Name" },
      ...Object.entries(months).map(([month, days]) => ({
        type: 'month',
        month: '1st row for date of ' + month,
        days,
      })),
      { type: 'fixed', label: 'Absent' },
      { type: 'fixed', label: 'Tardy' },
    ];

    // Step 4: Build rows
    const rows = data.map((d) => {
      const row: (string | number)[] = [d.student_name];
      let absent = 0,
        tardy = 0;

      Object.entries(months).forEach(([month, days]) => {
        days.forEach((day) => {
          const year = new Date(allDates[0]).getFullYear(); // take year from dataset
          const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          const val = d[dateStr] ?? '';
          row.push(val);

          if (val === '0') absent++;
          if (val === '2') tardy++;
        });
      });

      row.push(absent, tardy);
      return row;
    });

    return { headers, rows };
  }

  async getSchoolForm10(school_yearID: number, teacherID: number) {
    let teacherData = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'RS.id as roomID',
        // 'RS.grade_level as grade_level'
      ])
      .leftJoin(RoomsSection, 'RS', 'RS.teacherID = UD.id')
      .where('UD.id = :teacherID', { teacherID })
      // .andWhere('RS.id = :roomID', { roomID })
      .getRawOne();
    let roomID = teacherData.roomID;
    let roomData = await this.dataSource.manager
      .createQueryBuilder(RoomsSection, 'RS')
      .select([
        'RS.*',
        'AS.strand_name as strand_name',
        'AT.tracks_name as tracks_name',
        // "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        // 'UD.id as id',
        // 'RS.room_section as room_section',
        // 'RS.grade_level as grade_level'
      ])
      .leftJoin(AddStrand, 'AS', 'AS.id = RS.strandId')
      .leftJoin(AddTracks, 'AT', 'AT.id = AS.trackId')
      .where('RS.id = :roomID', { roomID })
      // .andWhere('RS.id = :roomID', { roomID })
      .getRawOne();
    //  console.log(teacherData)

    let schoolYear = await this.dataSource.manager
      .createQueryBuilder(SchoolYear, 'SY')
      .select([
        // "*",
        "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
        "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate",
      ])
      .where('SY.id = :school_yearID', { school_yearID })
      .getRawOne();

    let query = this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        // "ES.*",
        'ES.id as id',
        'ES.sex as sex',
        'ES.bdate as bdate',
        'ES.lrnNo as lrnNo',
        'UPPER(ES.fname) as fname',
        'UPPER(ES.lname) as lname',
        'UPPER(ES.mname) as mname',
        "IF (!ISNULL(ES.mname) AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ', SUBSTRING(ES.mname, 1, 1), '. ', ES.lname), concat(ES.fname, ' ', ES.lname)) as name",
        'SQF.transmuted_grade as final_grade',
        'SQF.initial_grade as initial_grade',
        'SQF.quarter as quarter',
        'SQF.semester as semester',
        'SQF.sub_subject as sub_subject',
        'S.subject_title as subject_title',
        'S.indicator as indicator',
      ])
      .leftJoin(StudentList, 'SL', 'ES.id = SL.studentId')
      .leftJoin(StudentQuarterFinalGrade, 'SQF', 'SQF.studentID = ES.id')
      .leftJoin(Subject, 'S', 'S.id = SQF.subjectID')
      .where('SQF.school_yearID = :school_yearID', { school_yearID })
      .andWhere('SQF.roomID = :roomID', { roomID })
      // .andWhere('SQF.semester = :semester', { semester })
      .andWhere('ES.statusEnrolled = 1');

    let rawData = await query.getRawMany();
    let level;
    if (
      roomData.grade_level == 'Grade 11' ||
      roomData.grade_level == 'Grade 12'
    ) {
      level = 'Senior High';
    } else {
      level = 'Junior High';
    }
    let newData = await this.transformGrades(rawData, level);
    // console.log(newData[0])
    let curDate = new Date();

    let headerImg = join(
      process.cwd(),
      process.env.FILE_PATH + 'static/img/header.png',
    );
    // let footerImg = join(process.cwd(), '/static/img/deped.png');

    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        // footer_img: this.base64_encode(footerImg, 'headerfooter'),
        schoolYear: schoolYear,
        teacherData: teacherData,
        rawData: newData,
        // updatedRow:updatedRow,
        roomData: roomData,
        level: level,
        curDate: this.formatDate(curDate),
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('school-form10', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.10in',
          bottom: '0.20in',
          right: '0.10in',
        },
        landscape: false,
        printBackground: true,
      });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async transformGrades(data, level: 'Senior High' | 'Junior High') {
    const students: Record<string, any> = {};

    const average = (values: (number | null)[]): number | null => {
      const nums = values.filter((v) => v !== null) as number[];
      if (nums.length === 0) return null;
      return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    };

    data.forEach((d) => {
      if (!students[d.id]) {
        students[d.id] = {
          id: d.id,
          sex: d.sex,
          bdate: this.formatDate(d.bdate),
          lrnNo: d.lrnNo,
          fname: d.fname,
          lname: d.lname,
          mname: d.mname,
          name: d.name,
        };

        if (level === 'Senior High') {
          students[d.id].firstSemester = [];
          students[d.id].secondSemester = [];
        } else {
          students[d.id].juniorHigh = [];
        }
      }

      // ==========================================================
      //  SENIOR HIGH
      // ==========================================================
      if (level === 'Senior High') {
        const semesterArray =
          d.semester === '1st Semester'
            ? students[d.id].firstSemester
            : students[d.id].secondSemester;

        let subj = semesterArray.find((s) => s.subject === d.subject_title);
        if (!subj) {
          subj = {
            indicator: d.indicator,
            subject: d.subject_title,
            '1st Quarter': null,
            '2nd Quarter': null,
            finalGrade: null,
            remarks: null,
          };
          semesterArray.push(subj);
        }

        subj[d.quarter] = d.final_grade;

        // compute final grade for SHS per semester
        const q1 = subj['1st Quarter'];
        const q2 = subj['2nd Quarter'];
        const quarters = [q1, q2].filter((q) => q !== null);
        if (quarters.length > 0) {
          subj.finalGrade =
            quarters.reduce((a, b) => a + b, 0) / quarters.length;
          subj.remarks = subj.finalGrade >= 75 ? 'Passed' : 'Failed';
        }

        // Compute semester general averages
        if (level === 'Senior High') {
          const first = students[d.id].firstSemester;
          const second = students[d.id].secondSemester;

          if (first.length > 0) {
            const grades = first
              .map((s) => s.finalGrade)
              .filter((g) => g !== null);
            if (grades.length > 0) {
              const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
              students[d.id].firstSemesterAverage = avg;
              students[d.id].firstSemesterRemarks =
                avg >= 75 ? 'Passed' : 'Failed';
            }
          }

          if (second.length > 0) {
            const grades = second
              .map((s) => s.finalGrade)
              .filter((g) => g !== null);
            if (grades.length > 0) {
              const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
              students[d.id].secondSemesterAverage = avg.toFixed();
              students[d.id].secondSemesterRemarks =
                avg >= 75 ? 'Passed' : 'Failed';
            }
          }
        }
      }

      // ==========================================================
      //  JUNIOR HIGH
      // ==========================================================
      else {
        // check if subject is MAPEH (with sub-subject JSON)
        if (d.subject_title === 'MAPEH' && d.sub_subject) {
          let mapeh = students[d.id].juniorHigh.find(
            (s) => s.subject === 'MAPEH',
          );
          if (!mapeh) {
            mapeh = {
              subject: 'MAPEH',
              indicator: null,
              '1st Quarter': null,
              '2nd Quarter': null,
              '3rd Quarter': null,
              '4th Quarter': null,
              finalGrade: null,
              remarks: null,
              sub_subject: {},
            };
            students[d.id].juniorHigh.push(mapeh);
          }

          // ✅ Parse JSON from DB
          let subs: any = {};
          try {
            subs = JSON.parse(d.sub_subject);
          } catch {
            subs = {};
          }

          // Loop sub-subjects
          Object.entries(subs).forEach(([subName, subData]: [string, any]) => {
            if (!mapeh.sub_subject[subName]) {
              mapeh.sub_subject[subName] = {
                initial_grade: null,
                transmuted_grade: null,
                finalGrade: null,
                remarks: null,
                quarters: {
                  '1st Quarter': null,
                  '2nd Quarter': null,
                  '3rd Quarter': null,
                  '4th Quarter': null,
                },
              };
            }

            const sub = mapeh.sub_subject[subName];
            sub.initial_grade = Math.round(parseFloat(subData.initial_grade));
            sub.transmuted_grade = subData.transmuted_grade;
            sub.quarters[d.quarter] = sub.transmuted_grade;

            // compute sub final
            const subQuarters = Object.values(sub.quarters).filter(
              (q) => q !== null,
            ) as number[];
            if (subQuarters.length > 0) {
              sub.finalGrade = average(subQuarters);
              sub.remarks = sub.finalGrade >= 75 ? 'Passed' : 'Failed';
            }
          });

          // recompute MAPEH quarter = average of sub-subjects
          const quarterGrades = Object.values(mapeh.sub_subject)
            .map((s: any) => s.quarters[d.quarter])
            .filter((g: any) => g !== null) as number[];

          if (quarterGrades.length > 0) {
            mapeh[d.quarter] = average(quarterGrades);
          }

          // recompute MAPEH final
          const quarters = [
            mapeh['1st Quarter'],
            mapeh['2nd Quarter'],
            mapeh['3rd Quarter'],
            mapeh['4th Quarter'],
          ].filter((q) => q !== null) as number[];

          if (quarters.length > 0) {
            mapeh.finalGrade = average(quarters);
            mapeh.remarks = mapeh.finalGrade >= 75 ? 'Passed' : 'Failed';
          }
        }

        // 🔹 Normal subjects
        else {
          let subj = students[d.id].juniorHigh.find(
            (s) => s.subject === d.subject_title,
          );
          if (!subj) {
            subj = {
              subject: d.subject_title,
              indicator: d.indicator,
              '1st Quarter': null,
              '2nd Quarter': null,
              '3rd Quarter': null,
              '4th Quarter': null,
              finalGrade: null,
              remarks: null,
            };
            students[d.id].juniorHigh.push(subj);
          }

          subj[d.quarter] = d.final_grade;
          subj.finalGrade = average([
            subj['1st Quarter'],
            subj['2nd Quarter'],
            subj['3rd Quarter'],
            subj['4th Quarter'],
          ]);
          subj.remarks =
            subj.finalGrade !== null
              ? subj.finalGrade >= 75
                ? 'Passed'
                : 'Failed'
              : null;
        }

        // 🔹 Junior High general average
        Object.values(students).forEach((student) => {
          const subjects = student.juniorHigh;
          const grades = subjects
            .map((s: any) => s.finalGrade)
            .filter((g: any) => g !== null);
          if (grades.length > 0) {
            const avg = average(grades);
            student.juniorHighAverage = avg;
            student.juniorHighRemarks = avg >= 75 ? 'Passed' : 'Failed';
          }
        });
      }
    });

    return Object.values(students);
  }
  // async getQRCode(id: string) {
  //   let d = await QRCode.toDataURL(id)
  //     .then((url) => {
  //       return url;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  //   let qrdata = {
  //     url: d,
  //   };

  //   try {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();

  //     const content = await this.compile('qrcode', qrdata);

  //     await page.setContent(content);

  //     const buffer = await page.pdf({
  //       format: 'letter',
  //       margin: {
  //         top: '0.25in',
  //         left: '0.25in',
  //         bottom: '0.25in',
  //         right: '0.25in',
  //       },
  //       landscape: false,
  //       printBackground: true,
  //     });
  //     console.log('done');
  //     await browser.close();
  //     return buffer;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
