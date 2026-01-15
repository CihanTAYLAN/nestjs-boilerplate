import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipTransform } from 'src/common/decorators/skip-transform.decorator';
import { ApiCategory, ApiDocService } from './api-doc.service';

@Controller()
@ApiExcludeController()
@Public()
@SkipTransform()
export class ApiDocController {
  constructor(private apiDocService: ApiDocService) {}

  @Get('swagger-doc-json/:category')
  @ApiOperation({ operationId: 'Get Category Swagger JSON' })
  async getCategorySwaggerJson(
    @Param('category') category: ApiCategory,
    @Res() response: Response,
  ) {
    try {
      const mainDocument = await this.apiDocService.createMainDocument();
      const categoryDocument = this.apiDocService.createCategoryDocument(
        mainDocument,
        category,
      );

      response
        .header('Content-Type', 'application/json')
        .json(categoryDocument);
    } catch (error) {
      response.status(500).json({
        success: false,
        message: 'Failed to generate category documentation',
        error: error.message,
      });
    }
  }

  @Get(':category')
  @Render('api-doc')
  @ApiOperation({ operationId: 'Get Category Api Documentation' })
  async apiDocByCategory(@Param('category') category: string) {
    return this.renderDoc(category);
  }

  @Get()
  @Render('api-doc')
  @ApiOperation({ operationId: 'Get Main Api Documentation' })
  async apiDocMain() {
    return this.renderDoc();
  }

  private async renderDoc(category?: string) {
    const mainDocument = await this.apiDocService.createMainDocument();
    const categories = this.apiDocService.getAllCategories(mainDocument);

    const defaultCategory =
      category && categories.includes(category.toLowerCase())
        ? category.toLowerCase()
        : categories.length > 0
          ? categories[0]
          : 'app';

    return {
      title: 'NestJS Boilerplate API Documentation',
      categories,
      defaultCategory,
    };
  }
}
