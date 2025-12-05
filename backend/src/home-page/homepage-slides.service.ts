import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomepageSlideDto } from './dto/CreateHompageSlides.dto';
import { UpdateHomepageSlideDto } from './dto/UpdateHomepageSlides.dto';
import { FileUtils } from '@/common/utils/file.utils';
import { TranslationSyncUtil } from '@/common/utils/translation-sync.util';
import { LANGUAGES } from '@/common/constants/language';

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
        link: slide.link,
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
        link: slide.link,
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
      link: slide.link,
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
        image: imagePath,
        link: dto.link || null,
        order: dto.order || 0,
        isActive: dto.isActive ?? true,
      },
      include: {
        translations: true,
      },
    });

    await this.prisma.homepageSlideTranslations.createMany({
      data: LANGUAGES.map((lang) => ({
        slideId: slide.id,
        language: lang,
        title: lang === 'en' && dto.title ? dto.title : '',
      })),
      skipDuplicates: true,
    });

    return this.findOne(slide.id);
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

    if (image && existingSlide.image) {
      await FileUtils.deleteFile(existingSlide.image);
    }

    const updateData: any = {};
    if (dto.order !== undefined) updateData.order = dto.order;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.link !== undefined) updateData.link = dto.link;
    if (image) {
      const imagePath = FileUtils.generateImageUrl(image, 'homepage-slides');
      if (imagePath) {
        updateData.image = imagePath;
      }
    }

    const slide = await this.prisma.homepageSlide.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
      },
    });

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

    return this.findOne(slide.id);
  }

  async deleteSlide(id: number) {
    const slide = await this.prisma.homepageSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    if (slide.image) {
      await FileUtils.deleteFile(slide.image);
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
        translations: {
          orderBy: { language: 'asc' },
        },
      },
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    await TranslationSyncUtil.syncMissingTranslations(this.prisma, {
      entityId: id,
      entityIdField: 'slideId',
      translationModel: this.prisma.homepageSlideTranslations,
      existingTranslations: slide.translations,
      defaultFields: { title: '' },
    });

    const updatedSlide = await this.prisma.homepageSlide.findUnique({
      where: { id },
      include: {
        translations: {
          orderBy: { language: 'asc' },
        },
      },
    });

    return updatedSlide!.translations;
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
    if (language === 'en') {
      throw new ConflictException('Cannot delete English translation');
    }

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

  async syncAllTranslations() {
    return TranslationSyncUtil.syncAllEntities(
      this.prisma,
      this.prisma.homepageSlide,
      'slideId',
      this.prisma.homepageSlideTranslations,
      () => ({ title: '' }),
    );
  }
}
