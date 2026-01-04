import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { UpsertProjectTranslationDto } from './dto/UpsertProjectTranslations.dto';
import { AuthGuard } from '@/auth/guards/basic-auth.guard';
import { Region } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('seo-preview/:id')
  @ApiOperation({
    summary: 'Get HTML with meta tags for social media bots',
  })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @Header('Content-Type', 'text/html; charset=utf-8')
  async getSeoPreview(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const project = await this.projectsService.findOne(id, 'en');

      if (!project) {
        return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Project Not Found | United Construction and Real Estate</title>
            <meta name="robots" content="noindex">
          </head>
          <body>
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist or has been removed.</p>
          </body>
        </html>
      `);
      }

      const getQuarter = (dateString: Date | string | null): string | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        const month = date.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        const year = date.getFullYear();
        return `Q${quarter} ${year}`;
      };

      const projectName =
        project.translation?.projectName || project.projectName;
      const priceText = project.priceFrom
        ? `Starting from $${project.priceFrom.toLocaleString()}`
        : '';
      const deliveryText = project.deliveryDate
        ? `Delivery ${getQuarter(project.deliveryDate)}`
        : '';

      const title = projectName
        ? `${projectName} | United Construction and Real Estate`
        : 'Project Details | United Construction and Real Estate';

      const description = `Explore ${projectName || 'this premium real estate project'} in ${project.regionName || 'Batumi'}. ${priceText}${priceText && deliveryText ? '. ' : ''}${deliveryText}. View available apartments and project details.`;

      const keywords = `${projectName || 'project'}, real estate ${project.regionName || 'Batumi'}, apartments ${project.regionName || 'Batumi'}, new construction, ${project.regionName || 'Batumi'} property, developer project`;

      let imageUrl = 'https://unitedcompany.ge/Logo.png';

      if (project.image) {
        const imgPath = project.image;
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          imageUrl = imgPath;
        } else if (imgPath.includes('uploads/')) {
          imageUrl = `https://api.unitedcompany.ge/${imgPath.replace(/^\/+/, '')}`;
        } else if (imgPath.startsWith('/uploads/')) {
          imageUrl = `https://api.unitedcompany.ge${imgPath}`;
        } else if (imgPath.startsWith('/')) {
          imageUrl = `https://api.unitedcompany.ge${imgPath}`;
        } else {
          imageUrl = `https://api.unitedcompany.ge/uploads/${imgPath}`;
        }
      } else if (project.gallery && project.gallery.length > 0) {
        const imgPath = project.gallery[0];
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          imageUrl = imgPath;
        } else if (imgPath.includes('uploads/')) {
          imageUrl = `https://api.unitedcompany.ge/${imgPath.replace(/^\/+/, '')}`;
        } else if (imgPath.startsWith('/uploads/')) {
          imageUrl = `https://api.unitedcompany.ge${imgPath}`;
        } else if (imgPath.startsWith('/')) {
          imageUrl = `https://api.unitedcompany.ge${imgPath}`;
        } else {
          imageUrl = `https://api.unitedcompany.ge/uploads/${imgPath}`;
        }
      }

      const canonicalUrl = `https://unitedcompany.ge/projects/${id}`;

      const escapeHtml = (text: string): string => {
        const map: { [key: string]: string } = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
      };

      const safeTitle = escapeHtml(title);
      const safeDescription = escapeHtml(description.substring(0, 160));
      const safeKeywords = escapeHtml(keywords);
      const safeProjectName = escapeHtml(projectName || 'Project');

      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${safeTitle}</title>
        <meta name="description" content="${safeDescription}" />
        <meta name="keywords" content="${safeKeywords}" />
        <link rel="canonical" href="${canonicalUrl}" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:title" content="${safeTitle}" />
        <meta property="og:description" content="${safeDescription}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:secure_url" content="${imageUrl}" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="United Construction and Real Estate" />
        <meta property="og:locale" content="en_US" />

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${safeTitle}" />
        <meta name="twitter:description" content="${safeDescription}" />
        <meta name="twitter:image" content="${imageUrl}" />

        <!-- Redirect non-bots to React app -->
        <script>
          if (!/bot|crawler|spider|crawling|facebookexternalhit|whatsapp|twitter|telegram|linkedin|discord|slack/i.test(navigator.userAgent)) {
            window.location.href = "${canonicalUrl}";
          }
        </script>
      </head>
      <body>
        <h1>${safeProjectName}</h1>
        <img src="${imageUrl}" alt="${safeProjectName}" style="max-width:100%; height:auto;" />
        <p>${safeDescription}</p>
        <p>If you're not redirected, <a href="${canonicalUrl}">click here</a>.</p>
      </body>
      </html>`;

      return res.send(html);
    } catch (error) {
      console.error('❌ Error in getSeoPreview:', error);
      return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Error | United Construction and Real Estate</title>
        </head>
        <body>
          <h1>Internal Server Error</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        </body>
      </html>
    `);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with filters and pagination' })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Language code (e.g., en, ka, ru)',
    example: 'en',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 9,
    type: 'number',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Filter by location (city)',
    example: 'Batumi',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Filter by region',
    example: 'ADJARA',
  })
  @ApiQuery({
    name: 'priceFrom',
    required: false,
    description: 'Minimum price filter',
    example: 50000,
    type: 'number',
  })
  @ApiQuery({
    name: 'priceTo',
    required: false,
    description: 'Maximum price filter',
    example: 200000,
    type: 'number',
  })
  @ApiQuery({
    name: 'partnerId',
    required: false,
    description: 'Filter by partner ID',
    example: 1,
    type: 'number',
  })
  @ApiQuery({
    name: 'public',
    required: false,
    description:
      'Filter by public visibility (defaults to true for client-facing)',
    example: true,
    type: 'boolean',
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(
    @Query('lang') lang?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('location') location?: string,
    @Query('region') region?: string, // ✅ Changed from Region to string
    @Query('priceFrom') priceFrom?: string,
    @Query('priceTo') priceTo?: string,
    @Query('partnerId') partnerId?: string,
    @Query('public') isPublic?: string,
  ) {
    return this.projectsService.findAll({
      lang: lang || 'en',
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      location,
      region: region as Region | undefined, // ✅ Cast to Region enum
      priceFrom: priceFrom ? parseFloat(priceFrom) : undefined,
      priceTo: priceTo ? parseFloat(priceTo) : undefined,
      partnerId: partnerId ? parseInt(partnerId, 10) : undefined,
      public:
        isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Language code (e.g., en, ka, ru)',
    example: 'en',
  })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
  ) {
    return this.projectsService.findOne(id, lang || 'en');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 409, description: 'Project already exists' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
      ],
      multerConfig('projects'),
    ),
  )
  @ApiBody({ type: CreateProjectDto })
  async createProject(
    @Body() dto: CreateProjectDto,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.createProject(
      dto,
      files?.image?.[0],
      files?.gallery,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 20 },
      ],
      multerConfig('projects'),
    ),
  )
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Project update data',
  })
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.updateProject(
      id,
      dto,
      files?.image?.[0],
      files?.gallery,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Delete(':id/gallery/:imageIndex')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific gallery image from project' })
  @ApiParam({ name: 'id', description: 'Project ID', type: 'number' })
  @ApiParam({ name: 'imageIndex', description: 'Image index', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Gallery image deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Project or image not found' })
  async deleteGalleryImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageIndex', ParseIntPipe) imageIndex: number,
  ) {
    return this.projectsService.deleteGalleryImage(id, imageIndex);
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
      dto.street,
    );
  }

  @Delete(':id/translations/:language')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
