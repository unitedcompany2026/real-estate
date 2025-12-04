// homepage-slides.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as fs from 'fs';
import * as path from 'path';
import { CreateHomepageSlideDto } from './dto/CreateHompageSlides.dto';
import { UpdateHomepageSlideDto } from './dto/UpdateHomepageSlides.dto';
import { FileUtils } from '@/common/utils/file.utils';

@Injectable()
export class HomepageSlidesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang?: string) {
    const slides = await this.prisma.homepageSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        translations: lang ? { where: { language: lang } } : true,
      },
    });

    return slides.map((slide) => {
      const translation = lang
        ? slide.translations[0]
        : slide.translations.find((t) => t.language === 'en');

      return {
        id: slide.id,
        image: slide.image,
        order: slide.order,
        isActive: slide.isActive,
        title: translation?.title || '',
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
      };
    });
  }

  async findAllAdmin(lang?: string) {
    const slides = await this.prisma.homepageSlide.findMany({
      orderBy: { order: 'asc' },
      include: {
        translations: lang ? { where: { language: lang } } : true,
      },
    });

    return slides.map((slide) => {
      const translation = lang
        ? slide.translations[0]
        : slide.translations.find((t) => t.language === 'en');

      return {
        id: slide.id,
        image: slide.image,
        order: slide.order,
        isActive: slide.isActive,
        title: translation?.title || '',
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
      };
    });
  }

  async findOne(id: number, lang?: string) {
    const slide = await this.prisma.homepageSlide.findUnique({
      where: { id },
      include: {
        translations: lang ? { where: { language: lang } } : true,
      },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    const translation = lang
      ? slide.translations[0]
      : slide.translations.find((t) => t.language === 'en');

    return {
      id: slide.id,
      image: slide.image,
      order: slide.order,
      isActive: slide.isActive,
      title: translation?.title || '',
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    };
  }

  async createSlide(dto: CreateHomepageSlideDto, image?: Express.Multer.File) {
    if (!image) {
      throw new ConflictException('Image is required');
    }

    const imagePath = FileUtils.generateImageUrl(image, 'homepage-slides');

    if (!imagePath) {
      throw new ConflictException('Failed to generate image path');
    }

    const slide = await this.prisma.homepageSlide.create({
      data: {
        image: imagePath, // << store full relative path
        order: dto.order || 0,
        isActive: dto.isActive ?? true,
        translations: {
          create: {
            language: 'en',
            title: dto.title,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return slide;
  }

  async updateSlide(
    id: number,
    dto: UpdateHomepageSlideDto,
    image?: Express.Multer.File,
  ) {
    const existingSlide = await this.prisma.homepageSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    // Delete old image if new one is uploaded
    if (image && existingSlide.image) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads',
        'homepage-slides',
        existingSlide.image,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData: any = {};
    if (dto.order !== undefined) updateData.order = dto.order;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (image) updateData.image = image.filename;

    const slide = await this.prisma.homepageSlide.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
      },
    });

    // Update default translation if title is provided
    if (dto.title) {
      await this.prisma.homepageSlideTranslations.upsert({
        where: {
          slideId_language: {
            slideId: id,
            language: 'en',
          },
        },
        create: {
          slideId: id,
          language: 'en',
          title: dto.title,
        },
        update: {
          title: dto.title,
        },
      });
    }

    return slide;
  }

  async deleteSlide(id: number) {
    const slide = await this.prisma.homepageSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    // Delete image file
    if (slide.image) {
      const imagePath = path.join(
        process.cwd(),
        'uploads',
        'homepage-slides',
        slide.image,
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.prisma.homepageSlide.delete({
      where: { id },
    });

    return { message: 'Slide deleted successfully', id };
  }

  async getTranslations(id: number) {
    const slide = await this.prisma.homepageSlide.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    return slide.translations;
  }

  async upsertTranslation(id: number, language: string, title: string) {
    const slide = await this.prisma.homepageSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    const translation = await this.prisma.homepageSlideTranslations.upsert({
      where: {
        slideId_language: {
          slideId: id,
          language,
        },
      },
      create: {
        slideId: id,
        language,
        title,
      },
      update: {
        title,
      },
    });

    return translation;
  }

  async deleteTranslation(id: number, language: string) {
    const translation = await this.prisma.homepageSlideTranslations.findUnique({
      where: {
        slideId_language: {
          slideId: id,
          language,
        },
      },
    });

    if (!translation) {
      throw new NotFoundException(`Translation not found`);
    }

    await this.prisma.homepageSlideTranslations.delete({
      where: {
        slideId_language: {
          slideId: id,
          language,
        },
      },
    });

    return { message: 'Translation deleted successfully' };
  }
}
