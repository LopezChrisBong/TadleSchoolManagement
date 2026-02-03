import { PartialType } from '@nestjs/swagger';
import { CreateLardoStudentNotificationDto } from './create-lardo-student-notification.dto';

export class UpdateLardoStudentNotificationDto extends PartialType(
  CreateLardoStudentNotificationDto,
) {}
