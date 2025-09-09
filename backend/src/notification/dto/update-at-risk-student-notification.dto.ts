import { PartialType } from '@nestjs/swagger';
import { CreateAtRiskStudentNotificationDto } from './create-at-risk-student-notification.dto';

export class UpdateAtRiskStudentNotificationDto extends PartialType(CreateAtRiskStudentNotificationDto) {}
