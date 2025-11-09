// projects.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@/common/config/multer.config';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create project',
    description:
      'Create a new project with partner relation and optional image upload',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Project with this name already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or partner does not exist',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig('projects')))
  @ApiBody({
    type: CreateProjectDto,
    description: 'Project data including partnerId in body',
  })
  async createProject(
    @Body() dto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.createProject(dto, file);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update project',
    description: 'Update existing project including partner relation',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or partner does not exist',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig('projects')))
  @ApiBody({
    type: UpdateProjectDto,
    description:
      'Updated project data with id in body (all fields optional except id)',
  })
  async updateProject(
    @Body() dto: UpdateProjectDto, // ✅ id now in DTO
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.updateProject(dto, file); // ✅ Pass DTO directly
  }

  @Delete() // ✅ Removed :projectId param
  @ApiOperation({
    summary: 'Delete project',
    description: 'Delete project and associated image file',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Project deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  // @ApiBody({ type: DeleteProjectDto }) // ✅ Added body
  async deleteProject(@Body() dto: any) {
    // ✅ id now in DTO
    return this.projectsService.deleteProject(dto.id);
  }
}
