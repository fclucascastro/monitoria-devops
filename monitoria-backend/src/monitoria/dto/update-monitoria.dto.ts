import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoriaDto } from './create-monitoria.dto';

export class UpdateMonitoriaDto extends PartialType(CreateMonitoriaDto) {}
