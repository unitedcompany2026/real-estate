import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { FileUtils } from '@/common/utils/file.utils';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { Projects } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Projects[]> {
    return this.prismaService.projects.findMany({
      include: { partner: true },
    });
  }

  async createProject(
    dto: CreateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Projects> {
    await this.validatePartnerExists(dto.partnerId);

    const existingProject = await this.prismaService.projects.findUnique({
      where: { projectName: dto.projectName },
    });

    if (existingProject) {
      throw new ConflictException('Project with this name already exists');
    }

    const imagePath = file
      ? FileUtils.generateImageUrl(file, 'projects')
      : null;

    return this.prismaService.projects.create({
      data: {
        projectName: dto.projectName,
        projectLocation: dto.projectLocation,
        image: imagePath,
        partner: {
          connect: { id: dto.partnerId },
        },
      },
      include: { partner: true },
    });
  }

  async updateProject(
    dto: UpdateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Projects> {
    const existingProject = await this.prismaService.projects.findUnique({
      where: { id: dto.id }, // Changed from dto.partnerId
    });

    if (!existingProject) {
      throw new NotFoundException('Project does not exist');
    }

    if (dto.partnerId) {
      await this.validatePartnerExists(dto.partnerId);
    }

    let imagePath = existingProject.image;
    if (file) {
      imagePath = FileUtils.generateImageUrl(file, 'projects');
      if (existingProject.image) {
        FileUtils.deleteFile(existingProject.image);
      }
    }

    const updateData: any = {
      ...(dto.projectName && { projectName: dto.projectName }),
      ...(dto.projectLocation && { projectLocation: dto.projectLocation }),
      image: imagePath,
    };

    if (dto.partnerId) {
      updateData.partner = {
        connect: { id: dto.partnerId },
      };
    }

    // ✅ FIXED: Use dto.id instead of dto.partnerId
    return this.prismaService.projects.update({
      where: { id: dto.id }, // Changed from dto.partnerId
      data: updateData,
      include: { partner: true },
    });
  }

  async deleteProject(projectId: number): Promise<{ message: string }> {
    const existingProject = await this.prismaService.projects.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new NotFoundException('Project does not exist');
    }

    if (existingProject.image) {
      FileUtils.deleteFile(existingProject.image);
    }

    await this.prismaService.projects.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  private async validatePartnerExists(partnerId: number): Promise<void> {
    const partner = await this.prismaService.partners.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new BadRequestException('Partner does not exist');
    }
  }
}
