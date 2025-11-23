import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/CreateProperty.dto';
import { UpdatePropertyDto } from './dto/UpdateProperty.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FileUtils } from '@/common/utils/file.utils';
import { LANGUAGES } from '@/common/constants/language';
import { CreatePropertyUnitDto } from './dto/CreatePropertyUnit.dto';
import { UpdatePropertyUnitDto } from './dto/UpdatePropertyUnit.dto';

interface FindAllParams {
  lang?: string;
  page?: number;
  limit?: number;
  propertyType?: string;
  status?: string;
}

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: FindAllParams = {}) {
    const { lang = 'en', page = 1, limit = 10, propertyType, status } = params;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;

    const total = await this.prismaService.property.count({ where });

    const properties = await this.prismaService.property.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        translations: {
          where: { language: lang },
          take: 1,
        },
        galleryImages: {
          orderBy: { order: 'asc' },
        },
        units: {
          include: {
            translations: {
              where: { language: lang },
              take: 1,
            },
          },
        },
      },
    });

    const mappedProperties = properties.map((property) => ({
      id: property.id,
      externalId: property.externalId,
      propertyType: property.propertyType,
      status: property.status,
      address: property.address,
      price: property.price,
      totalArea: property.totalArea,
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      floors: property.floors,
      floorsTotal: property.floorsTotal,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      translation: property.translations[0] || null,
      images: property.galleryImages,
      unitsCount: property.units.length,
    }));

    return {
      data: mappedProperties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string, lang = 'en') {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language: lang },
        },
        galleryImages: {
          orderBy: { order: 'asc' },
        },
        units: {
          include: {
            translations: {
              where: { language: lang },
            },
            galleryImages: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    return {
      ...property,
      translation: property.translations[0] || null,
    };
  }

  async createProperty(dto: CreatePropertyDto, images?: Express.Multer.File[]) {
    if (dto.externalId) {
      const existingProperty = await this.prismaService.property.findUnique({
        where: { externalId: dto.externalId },
      });

      if (existingProperty) {
        throw new ConflictException(
          `Property with external ID "${dto.externalId}" already exists`,
        );
      }
    }

    const property = await this.prismaService.property.create({
      data: {
        externalId: dto.externalId,
        propertyType: dto.propertyType,
        status: dto.status,
        address: dto.address,
        price: dto.price ? parseInt(dto.price as any) : null,
        totalArea: dto.totalArea ? parseInt(dto.totalArea as any) : null,
        rooms: dto.rooms ? parseInt(dto.rooms as any) : null,
        bedrooms: dto.bedrooms ? parseInt(dto.bedrooms as any) : null,
        bathrooms: dto.bathrooms ? parseInt(dto.bathrooms as any) : null,
        floors: dto.floors ? parseInt(dto.floors as any) : null,
        floorsTotal: dto.floorsTotal ? parseInt(dto.floorsTotal as any) : null,
        ceilingHeight: dto.ceilingHeight
          ? parseFloat(dto.ceilingHeight as any)
          : null,
        condition: dto.condition,
        isNonStandard: dto.isNonStandard || false,
        occupancy: dto.occupancy,
        heating: dto.heating,
        hotWater: dto.hotWater,
        parking: dto.parking,
        hasConditioner: dto.hasConditioner || false,
        hasFurniture: dto.hasFurniture || false,
        hasBed: dto.hasBed || false,
        hasSofa: dto.hasSofa || false,
        hasTable: dto.hasTable || false,
        hasChairs: dto.hasChairs || false,
        hasStove: dto.hasStove || false,
        hasRefrigerator: dto.hasRefrigerator || false,
        hasOven: dto.hasOven || false,
        hasWashingMachine: dto.hasWashingMachine || false,
        hasKitchenAppliances: dto.hasKitchenAppliances || false,
        hasBalcony: dto.hasBalcony || false,
        balconyArea: dto.balconyArea
          ? parseFloat(dto.balconyArea as any)
          : null,
        hasNaturalGas: dto.hasNaturalGas || false,
        hasInternet: dto.hasInternet || false,
        hasTV: dto.hasTV || false,
        hasSewerage: dto.hasSewerage || false,
        isFenced: dto.isFenced || false,
        hasYardLighting: dto.hasYardLighting || false,
        hasGrill: dto.hasGrill || false,
        hasAlarm: dto.hasAlarm || false,
        hasVentilation: dto.hasVentilation || false,
        hasWater: dto.hasWater || false,
        hasElectricity: dto.hasElectricity || false,
        hasGate: dto.hasGate || false,
      },
    });

    await this.prismaService.propertyTranslations.createMany({
      data: LANGUAGES.map((lang) => ({
        propertyId: property.id,
        language: lang,
        title: lang === 'en' && dto.title ? dto.title : '',
        description: lang === 'en' && dto.description ? dto.description : null,
      })),
      skipDuplicates: true,
    });

    if (images && images.length > 0) {
      const imageUrls = images
        .map((image, index) => ({
          url: FileUtils.generateImageUrl(image, 'properties'),
          order: index,
        }))
        .filter((item) => item.url !== null);

      if (imageUrls.length > 0) {
        await this.prismaService.propertyGalleryImage.createMany({
          data: imageUrls.map((item) => ({
            propertyId: property.id,
            imageUrl: item.url as string,
            order: item.order,
          })),
        });
      }
    }

    return this.findOne(property.id);
  }

  async updateProperty(
    id: string,
    dto: UpdatePropertyDto,
    images?: Express.Multer.File[],
  ) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    const updateData: any = {};
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.price !== undefined)
      updateData.price = dto.price ? parseInt(dto.price as any) : null;
    if (dto.totalArea !== undefined)
      updateData.totalArea = dto.totalArea
        ? parseInt(dto.totalArea as any)
        : null;
    if (dto.rooms !== undefined)
      updateData.rooms = dto.rooms ? parseInt(dto.rooms as any) : null;
    if (dto.bedrooms !== undefined)
      updateData.bedrooms = dto.bedrooms ? parseInt(dto.bedrooms as any) : null;
    if (dto.bathrooms !== undefined)
      updateData.bathrooms = dto.bathrooms
        ? parseInt(dto.bathrooms as any)
        : null;
    if (dto.floors !== undefined)
      updateData.floors = dto.floors ? parseInt(dto.floors as any) : null;
    if (dto.floorsTotal !== undefined)
      updateData.floorsTotal = dto.floorsTotal
        ? parseInt(dto.floorsTotal as any)
        : null;
    if (dto.ceilingHeight !== undefined)
      updateData.ceilingHeight = dto.ceilingHeight
        ? parseFloat(dto.ceilingHeight as any)
        : null;
    if (dto.condition !== undefined) updateData.condition = dto.condition;
    if (dto.isNonStandard !== undefined)
      updateData.isNonStandard = dto.isNonStandard;
    if (dto.occupancy !== undefined) updateData.occupancy = dto.occupancy;
    if (dto.heating !== undefined) updateData.heating = dto.heating;
    if (dto.hotWater !== undefined) updateData.hotWater = dto.hotWater;
    if (dto.parking !== undefined) updateData.parking = dto.parking;
    if (dto.hasConditioner !== undefined)
      updateData.hasConditioner = dto.hasConditioner;
    if (dto.hasFurniture !== undefined)
      updateData.hasFurniture = dto.hasFurniture;
    if (dto.hasBed !== undefined) updateData.hasBed = dto.hasBed;
    if (dto.hasSofa !== undefined) updateData.hasSofa = dto.hasSofa;
    if (dto.hasTable !== undefined) updateData.hasTable = dto.hasTable;
    if (dto.hasChairs !== undefined) updateData.hasChairs = dto.hasChairs;
    if (dto.hasStove !== undefined) updateData.hasStove = dto.hasStove;
    if (dto.hasRefrigerator !== undefined)
      updateData.hasRefrigerator = dto.hasRefrigerator;
    if (dto.hasOven !== undefined) updateData.hasOven = dto.hasOven;
    if (dto.hasWashingMachine !== undefined)
      updateData.hasWashingMachine = dto.hasWashingMachine;
    if (dto.hasKitchenAppliances !== undefined)
      updateData.hasKitchenAppliances = dto.hasKitchenAppliances;
    if (dto.hasBalcony !== undefined) updateData.hasBalcony = dto.hasBalcony;
    if (dto.balconyArea !== undefined)
      updateData.balconyArea = dto.balconyArea
        ? parseFloat(dto.balconyArea as any)
        : null;
    if (dto.hasNaturalGas !== undefined)
      updateData.hasNaturalGas = dto.hasNaturalGas;
    if (dto.hasInternet !== undefined) updateData.hasInternet = dto.hasInternet;
    if (dto.hasTV !== undefined) updateData.hasTV = dto.hasTV;
    if (dto.hasSewerage !== undefined) updateData.hasSewerage = dto.hasSewerage;
    if (dto.isFenced !== undefined) updateData.isFenced = dto.isFenced;
    if (dto.hasYardLighting !== undefined)
      updateData.hasYardLighting = dto.hasYardLighting;
    if (dto.hasGrill !== undefined) updateData.hasGrill = dto.hasGrill;
    if (dto.hasAlarm !== undefined) updateData.hasAlarm = dto.hasAlarm;
    if (dto.hasVentilation !== undefined)
      updateData.hasVentilation = dto.hasVentilation;
    if (dto.hasWater !== undefined) updateData.hasWater = dto.hasWater;
    if (dto.hasElectricity !== undefined)
      updateData.hasElectricity = dto.hasElectricity;
    if (dto.hasGate !== undefined) updateData.hasGate = dto.hasGate;

    const updatedProperty = await this.prismaService.property.update({
      where: { id },
      data: updateData,
    });

    if (images && images.length > 0) {
      const existingImages =
        await this.prismaService.propertyGalleryImage.findMany({
          where: { propertyId: id },
        });
      const maxOrder = existingImages.length;

      const imageUrls = images
        .map((image, index) => ({
          url: FileUtils.generateImageUrl(image, 'properties'),
          order: maxOrder + index,
        }))
        .filter((item) => item.url !== null);

      if (imageUrls.length > 0) {
        await this.prismaService.propertyGalleryImage.createMany({
          data: imageUrls.map((item) => ({
            propertyId: id,
            imageUrl: item.url as string,
            order: item.order,
          })),
        });
      }
    }

    return this.findOne(updatedProperty.id);
  }

  async deleteProperty(id: string) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      include: {
        galleryImages: true,
        units: {
          include: {
            galleryImages: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }

    for (const image of property.galleryImages) {
      await FileUtils.deleteFile(image.imageUrl);
    }

    for (const unit of property.units) {
      for (const image of unit.galleryImages) {
        await FileUtils.deleteFile(image.imageUrl);
      }
    }

    await this.prismaService.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully' };
  }

  async getTranslations(propertyId: string) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      include: {
        translations: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${propertyId}" not found`);
    }

    return property.translations;
  }

  async upsertTranslation(
    propertyId: string,
    language: string,
    title: string,
    description?: string,
  ) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${propertyId}" not found`);
    }

    const translation = await this.prismaService.propertyTranslations.upsert({
      where: {
        propertyId_language: {
          propertyId,
          language,
        },
      },
      update: {
        title,
        description,
      },
      create: {
        propertyId,
        language,
        title,
        description,
      },
    });

    return translation;
  }

  async deleteTranslation(propertyId: string, language: string) {
    const translation =
      await this.prismaService.propertyTranslations.findUnique({
        where: {
          propertyId_language: {
            propertyId,
            language,
          },
        },
      });

    if (!translation) {
      throw new NotFoundException(
        `Translation for language "${language}" not found`,
      );
    }

    await this.prismaService.propertyTranslations.delete({
      where: {
        propertyId_language: {
          propertyId,
          language,
        },
      },
    });

    return { message: 'Translation deleted successfully' };
  }

  async deleteGalleryImage(propertyId: string, imageId: number) {
    const image = await this.prismaService.propertyGalleryImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.propertyId !== propertyId) {
      throw new NotFoundException(`Image with ID "${imageId}" not found`);
    }

    await FileUtils.deleteFile(image.imageUrl);

    await this.prismaService.propertyGalleryImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }

  // Property Unit methods
  async createUnit(
    propertyId: string,
    dto: CreatePropertyUnitDto,
    images?: Express.Multer.File[],
  ) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${propertyId}" not found`);
    }

    const unit = await this.prismaService.propertyUnit.create({
      data: {
        propertyId,
        unitNumber: dto.unitNumber,
        floor: dto.floor ? parseInt(dto.floor as any) : null,
        area: parseInt(dto.area as any),
        rooms: dto.rooms ? parseInt(dto.rooms as any) : null,
        bedrooms: dto.bedrooms ? parseInt(dto.bedrooms as any) : null,
        bathrooms: dto.bathrooms ? parseInt(dto.bathrooms as any) : null,
        price: dto.price ? parseInt(dto.price as any) : null,
      },
    });

    await this.prismaService.propertyUnitTranslations.createMany({
      data: LANGUAGES.map((lang) => ({
        unitId: unit.id,
        language: lang,
        title: lang === 'en' && dto.title ? dto.title : null,
        description: lang === 'en' && dto.description ? dto.description : null,
      })),
      skipDuplicates: true,
    });

    if (images && images.length > 0) {
      const imageUrls = images
        .map((image, index) => ({
          url: FileUtils.generateImageUrl(image, 'property-units'),
          order: index,
        }))
        .filter((item) => item.url !== null);

      if (imageUrls.length > 0) {
        await this.prismaService.propertyUnitGalleryImage.createMany({
          data: imageUrls.map((item) => ({
            unitId: unit.id,
            imageUrl: item.url as string,
            order: item.order,
          })),
        });
      }
    }

    return unit;
  }

  async getUnits(propertyId: string, lang = 'en') {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID "${propertyId}" not found`);
    }

    const units = await this.prismaService.propertyUnit.findMany({
      where: { propertyId },
      include: {
        translations: {
          where: { language: lang },
        },
        galleryImages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return units.map((unit) => ({
      ...unit,
      translation: unit.translations[0] || null,
    }));
  }

  async updateUnit(
    propertyId: string,
    unitId: string,
    dto: UpdatePropertyUnitDto,
    images?: Express.Multer.File[],
  ) {
    const unit = await this.prismaService.propertyUnit.findUnique({
      where: { id: unitId },
    });

    if (!unit || unit.propertyId !== propertyId) {
      throw new NotFoundException(`Unit with ID "${unitId}" not found`);
    }

    const updateData: any = {};
    if (dto.unitNumber !== undefined) updateData.unitNumber = dto.unitNumber;
    if (dto.floor !== undefined)
      updateData.floor = dto.floor ? parseInt(dto.floor as any) : null;
    if (dto.area !== undefined) updateData.area = parseInt(dto.area as any);
    if (dto.rooms !== undefined)
      updateData.rooms = dto.rooms ? parseInt(dto.rooms as any) : null;
    if (dto.bedrooms !== undefined)
      updateData.bedrooms = dto.bedrooms ? parseInt(dto.bedrooms as any) : null;
    if (dto.bathrooms !== undefined)
      updateData.bathrooms = dto.bathrooms
        ? parseInt(dto.bathrooms as any)
        : null;
    if (dto.price !== undefined)
      updateData.price = dto.price ? parseInt(dto.price as any) : null;

    const updatedUnit = await this.prismaService.propertyUnit.update({
      where: { id: unitId },
      data: updateData,
    });

    if (images && images.length > 0) {
      const existingImages =
        await this.prismaService.propertyUnitGalleryImage.findMany({
          where: { unitId },
        });
      const maxOrder = existingImages.length;

      const imageUrls = images
        .map((image, index) => ({
          url: FileUtils.generateImageUrl(image, 'property-units'),
          order: maxOrder + index,
        }))
        .filter((item) => item.url !== null);

      if (imageUrls.length > 0) {
        await this.prismaService.propertyUnitGalleryImage.createMany({
          data: imageUrls.map((item) => ({
            unitId,
            imageUrl: item.url as string,
            order: item.order,
          })),
        });
      }
    }

    return updatedUnit;
  }

  async deleteUnit(propertyId: string, unitId: string) {
    const unit = await this.prismaService.propertyUnit.findUnique({
      where: { id: unitId },
      include: {
        galleryImages: true,
      },
    });

    if (!unit || unit.propertyId !== propertyId) {
      throw new NotFoundException(`Unit with ID "${unitId}" not found`);
    }

    for (const image of unit.galleryImages) {
      await FileUtils.deleteFile(image.imageUrl);
    }

    await this.prismaService.propertyUnit.delete({
      where: { id: unitId },
    });

    return { message: 'Unit deleted successfully' };
  }

  async upsertUnitTranslation(
    propertyId: string,
    unitId: string,
    language: string,
    title?: string,
    description?: string,
  ) {
    const unit = await this.prismaService.propertyUnit.findUnique({
      where: { id: unitId },
    });

    if (!unit || unit.propertyId !== propertyId) {
      throw new NotFoundException(`Unit with ID "${unitId}" not found`);
    }

    const translation =
      await this.prismaService.propertyUnitTranslations.upsert({
        where: {
          unitId_language: {
            unitId,
            language,
          },
        },
        update: {
          title,
          description,
        },
        create: {
          unitId,
          language,
          title,
          description,
        },
      });

    return translation;
  }

  async deleteUnitGalleryImage(
    propertyId: string,
    unitId: string,
    imageId: number,
  ) {
    const image = await this.prismaService.propertyUnitGalleryImage.findUnique({
      where: { id: imageId },
      include: { unit: true },
    });

    if (
      !image ||
      image.unitId !== unitId ||
      image.unit.propertyId !== propertyId
    ) {
      throw new NotFoundException(`Image with ID "${imageId}" not found`);
    }

    await FileUtils.deleteFile(image.imageUrl);

    await this.prismaService.propertyUnitGalleryImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}
