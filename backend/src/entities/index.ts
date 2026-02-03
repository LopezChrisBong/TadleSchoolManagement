import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Availability } from 'src/enroll-student/entities/availability.entity';
import { EnrollStudent } from 'src/enroll-student/entities/enroll-student.entity';
import { SchoolYear } from 'src/enroll-student/entities/scholl-year.entity';
import { StudentValues } from 'src/enroll-student/entities/student-values.entity';
import { AtRiskStudentNotification } from 'src/notification/entities/atrisk_student_notification.entity';
import { AtRiskStudentForFacultyNotification } from 'src/notification/entities/atrisk_student_to_faculty_notification.entity';
import { LardoStudentForFacultyNotification } from 'src/notification/entities/lardo_student_for_faculty_notification.entity';
import { LardoStudentNotification } from 'src/notification/entities/lardo_student_notification.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { ParentRecord } from 'src/parent-records/entities/parent-record.entity';
import { StudentReportDisciplinary } from 'src/parent-records/entities/student-report-disciplinary.entity';
import { AddStrand } from 'src/rooms-section/entities/add-strand.entity';
import { AddTracks } from 'src/rooms-section/entities/add-tracks.entity';
import { RoomsSection } from 'src/rooms-section/entities/rooms-section.entity';
import { StudentAttendance } from 'src/rooms-section/entities/student-attendance.entity';
import { StudentGrade } from 'src/rooms-section/entities/student-grade.entity';
import { StudentList } from 'src/rooms-section/entities/student-list.entity';
import { StudentQuarterFinalGrade } from 'src/rooms-section/entities/student-quarter-final-grade.entity';
import { TransmutedGrade } from 'src/rooms-section/entities/transmuted-grade.entity';
import { SchoolEvent } from 'src/school-events/entities/school-event.entity';
import { GradeLevel } from 'src/subjects/entities/grade-level.entity';
import { TeacherGradeLevel } from 'src/subjects/entities/prefered-grade-level.entity';
import { TeacherSubject } from 'src/subjects/entities/prefered-subject.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';

const entities = [
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  EnrollStudent,
  RoomsSection,
  AddTracks,
  AddStrand,
  Availability,
  SchoolYear,
  StudentList,
  TeacherSubject,
  Subject,
  TeacherGradeLevel,
  GradeLevel,
  StudentAttendance,
  StudentGrade,
  TransmutedGrade,
  StudentQuarterFinalGrade,
  StudentValues,
  ParentRecord,
  Notification,
  AtRiskStudentNotification,
  AtRiskStudentForFacultyNotification,
  LardoStudentNotification,
  LardoStudentForFacultyNotification,
  StudentReportDisciplinary,
  SchoolEvent
];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  EnrollStudent,
  RoomsSection,
  AddTracks,
  AddStrand,
  Availability,
  SchoolYear,
  StudentList,
  TeacherSubject,
  Subject,
  TeacherGradeLevel,
  GradeLevel,
  StudentAttendance,
  StudentGrade,
  TransmutedGrade,
  StudentQuarterFinalGrade,
  StudentValues,
  ParentRecord,
  Notification,
  AtRiskStudentNotification,
  AtRiskStudentForFacultyNotification,
  LardoStudentNotification,
  LardoStudentForFacultyNotification,
  StudentReportDisciplinary,
  SchoolEvent
};

export default entities;
