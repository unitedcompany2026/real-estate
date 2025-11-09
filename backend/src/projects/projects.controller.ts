import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { UpsertProjectTranslationDto } from './dto/UpsertProjectTranslations.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Language code (e.g., en, ka, ru)',
    example: 'en',
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(@Query('lang') lang?: string) {
    return this.projectsService.findAll(lang || 'en');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 409, description: 'Project already exists' })
  @UseInterceptors(FileInterceptor('image', multerConfig('projects')))
  @ApiBody({ type: CreateProjectDto })
  async createProject(
    @Body() dto: CreateProjectDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.projectsService.createProject(dto, image);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @UseInterceptors(FileInterceptor('image', multerConfig('projects')))
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Project update data',
  })
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.projectsService.updateProject(id, dto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Get(':id/translations')
  @ApiOperation({ summary: 'Get all translations for a project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Translations retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getTranslations(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getTranslations(id);
  }

  @Patch(':id/translations')
  @ApiOperation({ summary: 'Add or update a translation' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Translation added/updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiBody({ type: UpsertProjectTranslationDto })
  async upsertTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertProjectTranslationDto,
  ) {
    return this.projectsService.upsertTranslation(
      id,
      dto.language,
      dto.projectName,
      dto.projectLocation,
    );
  }

  @Delete(':id/translations/:language')
  @ApiOperation({ summary: 'Delete a specific translation' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiParam({
    name: 'language',
    description: 'Language code (e.g., ka, ru)',
    example: 'ka',
  })
  @ApiResponse({ status: 200, description: 'Translation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  async deleteTranslation(
    @Param('id', ParseIntPipe) id: number,
    @Param('language') language: string,
  ) {
    return this.projectsService.deleteTranslation(id, language);
  }
}
