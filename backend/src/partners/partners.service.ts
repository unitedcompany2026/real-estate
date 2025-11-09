import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePartnerDto } from './dto/UpdatePartner.dto';
import { CreatePartnerDto } from './dto/CreatePartner.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FileUtils } from '@/common/utils/file.utils';

@Injectable()
export class PartnersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(lang: string = 'en') {
    const partners = await this.prismaService.partners.findMany({
      include: {
        translations: {
          where: { language: lang },
          take: 1,
        },
      },
    });

    return partners.map((partner) => ({
      id: partner.id,
      companyName: partner.translations[0]?.companyName || partner.companyName,
      image: partner.image,
      createdAt: partner.createdAt,
    }));
  }

  async createPartner(dto: CreatePartnerDto, image?: Express.Multer.File) {
    const existName = await this.prismaService.partners.findUnique({
      where: { companyName: dto.companyName },
    });

    if (existName) {
      throw new ConflictException(
        `Partner "${dto.companyName}" already exists`,
      );
    }

    const partner = await this.prismaService.partners.create({
      data: {
        companyName: dto.companyName,
        image: image ? FileUtils.generateImageUrl(image, 'partners') : null,
      },
    });

    return partner;
  }

  async updatePartner(
    id: number,
    dto: UpdatePartnerDto,
    image?: Express.Multer.File,
  ) {
    const partner = await this.prismaService.partners.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID "${id}" not found`);
    }

    let imagePath = partner.image;

    if (image) {
      if (imagePath) {
        await FileUtils.deleteFile(imagePath);
      }
      imagePath = FileUtils.generateImageUrl(image, 'partners');
    }

    const updatedPartner = await this.prismaService.partners.update({
      where: { id },
      data: {
        image: imagePath,
      },
    });

    return updatedPartner;
  }

  async upsertTranslation(
    partnerId: number,
    language: string,
    companyName: string,
  ) {
    const partner = await this.prismaService.partners.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID "${partnerId}" not found`);
    }

    const translation = await this.prismaService.parnterTranslations.upsert({
      where: {
        partnerId_language: {
          partnerId,
          language,
        },
      },
      update: {
        companyName,
      },
      create: {
        partnerId,
        language,
        companyName,
      },
    });

    return translation;
  }

  async getTranslations(partnerId: number) {
    const partner = await this.prismaService.partners.findUnique({
      where: { id: partnerId },
      include: {
        translations: true,
      },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID "${partnerId}" not found`);
    }

    return partner.translations;
  }

  async deleteTranslation(partnerId: number, language: string) {
    const translation = await this.prismaService.parnterTranslations.findUnique(
      {
        where: {
          partnerId_language: {
            partnerId,
            language,
          },
        },
      },
    );

    if (!translation) {
      throw new NotFoundException(
        `Translation for language "${language}" not found`,
      );
    }

    await this.prismaService.parnterTranslations.delete({
      where: {
        partnerId_language: {
          partnerId,
          language,
        },
      },
    });

    return { message: 'Translation deleted successfully' };
  }

  async deletePartner(id: number) {
    const partner = await this.prismaService.partners.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID "${id}" not found`);
    }

    // Check if partner has any projects
    if (partner.projects && partner.projects.length > 0) {
      throw new ConflictException(
        `Cannot delete partner "${partner.companyName}" because it has ${partner.projects.length} associated project(s). Please delete or reassign the projects first.`,
      );
    }

    if (partner.image) {
      await FileUtils.deleteFile(partner.image);
    }

    await this.prismaService.partners.delete({
      where: { id },
    });

    return { message: 'Partner deleted successfully' };
  }
}
