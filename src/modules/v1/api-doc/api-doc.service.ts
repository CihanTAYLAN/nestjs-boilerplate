import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export type ApiCategory = string;

@Injectable()
export class ApiDocService {
  private app: any;
  private mainDocument: any;

  constructor(private configService: ConfigService) {}

  /**
   * App instance'ını set eder
   */
  setApp(app: any) {
    this.app = app;
  }

  /**
   * Ana swagger dokümanını oluşturur veya önbellekten döner
   */
  async createMainDocument() {
    if (this.mainDocument) {
      return this.mainDocument;
    }

    if (!this.app) {
      throw new Error(
        'ApiDocService: Application instance must be set before creating document',
      );
    }

    const config = new DocumentBuilder()
      .setTitle('NestJS Boilerplate Backend API')
      .setDescription(
        `
### Common Schema:
\`\`\`
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T | null;
  message: string;
  details?: string[];
}
\`\`\`
### Example 401 response:
\`\`\`
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized",
  "details": [
    "You are not authorized to this request"
  ]
}
\`\`\`
### Example 400 Validation error response:
\`\`\`
{
    "success": false,
    "statusCode": 400,
    "data": null,
    "message": "Bad Request",
    "details": [
        "title should not be empty",
        "user_id should not be empty",
        "user_id Invalid id",
        "is_active should not be empty",
        "is_active must be a boolean value"
    ]
}
\`\`\`
`,
      )
      .setVersion('1')
      .setContact(
        'NestJS Boilerplate Backend API',
        'https://github.com/cihantaylan/nestjs-boilerplate',
        'info@nestjs-boilerplate.com',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JwtAccess',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JwtRefresh',
      )
      .addServer(`${this.configService.get('app.url')}`, 'Local');

    this.mainDocument = SwaggerModule.createDocument(this.app, config.build());
    return this.mainDocument;
  }

  /**
   * Belirli bir kategoriye ait swagger dokümanını oluşturur
   */
  createCategoryDocument(fullDocument: any, category: ApiCategory): any {
    const filteredDocument = { ...JSON.parse(JSON.stringify(fullDocument)) }; // Deep clone

    // Paths'i kategoriye göre filtrele
    const filteredPaths: any = {};
    const categoryLower = category.toLowerCase();
    const usedTags = new Set<string>();

    for (const [path, methods] of Object.entries(fullDocument.paths || {})) {
      const normalizedPath = path.startsWith('/')
        ? path.toLowerCase()
        : `/${path.toLowerCase()}`;

      // Path'in kategoriye ait olup olmadığını kontrol et
      const includePath =
        normalizedPath.startsWith(`/api/v1/${categoryLower}/`) ||
        normalizedPath === `/api/v1/${categoryLower}`;

      if (includePath) {
        // Bu path'deki tüm metodları işle ve tag'lerini güncelle
        const updatedMethods: any = { ...(methods as object) };

        for (const operation of Object.values(updatedMethods)) {
          // Path'den subcategory çıkar: /api/v1/{category}/{subcategory}/...
          const pathParts = path.split('/').filter((p) => p.length > 0);
          const categoryIndex = pathParts.findIndex(
            (p) => p.toLowerCase() === categoryLower,
          );

          let tagName = category.toUpperCase();
          if (categoryIndex >= 0 && categoryIndex + 1 < pathParts.length) {
            const subcategory = pathParts[categoryIndex + 1];
            tagName = `${category.toUpperCase()} - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
          }

          // Operation tag'ini güncelle
          (operation as any).tags = [tagName];
          usedTags.add(tagName);
        }

        filteredPaths[path] = updatedMethods;
      }
    }

    filteredDocument.paths = filteredPaths;

    // Tags tanımlarını oluştur
    filteredDocument.tags = Array.from(usedTags).map((tagName) => ({
      name: tagName,
      description: `${tagName} endpoints`,
    }));

    // Info'yu güncelle
    filteredDocument.info = {
      ...filteredDocument.info,
      title: `${category.toUpperCase()} - NestJS Boilerplate Backend API`,
      description: `API documentation for ${category.toUpperCase()} endpoints only.`,
    };

    return filteredDocument;
  }

  /**
   * Tüm kategorileri swagger dokümanından çıkarır
   */
  getAllCategories(fullDocument: any): string[] {
    const categories = new Set<string>();
    const paths = Object.keys(fullDocument.paths || {});

    for (const path of paths) {
      // Normalize path: leading slash and lowercase
      const normalizedPath = path.startsWith('/')
        ? path.toLowerCase()
        : `/${path.toLowerCase()}`;

      // Look for /api/v1/{category}/ pattern
      const match = normalizedPath.match(/^\/api\/v1\/([^/]+)/);
      if (
        match &&
        match[1] &&
        match[1] !== 'doc' &&
        match[1] !== 'swagger-doc'
      ) {
        categories.add(match[1]);
      }
    }

    const result = Array.from(categories).sort();

    return result;
  }
}
