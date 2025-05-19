import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitoriaService } from './monitoria.service';
import { CreateMonitoriaDto } from './dto/create-monitoria.dto';
import { UpdateMonitoriaDto } from './dto/update-monitoria.dto';

@Controller('monitoria')
export class MonitoriaController {
  constructor(private readonly monitoriaService: MonitoriaService) {}

  @Post()
  create(@Body() createMonitoriaDto: CreateMonitoriaDto) {
    return this.monitoriaService.create(createMonitoriaDto);
  }

  @Get()
  findAll() {
    return this.monitoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoriaDto: UpdateMonitoriaDto) {
    return this.monitoriaService.update(+id, updateMonitoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoriaService.remove(+id);
  }
}
