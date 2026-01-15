import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DecoratorContextHost } from 'src/config/decoratorContextHost';
import { PrismaModels } from '../types/prismaModel.type';
import { ModelFields } from '../types/prismaModelField.type';

@ValidatorConstraint({ async: true })
export class IsExistConstraint<T extends PrismaModels>
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    if (!value) return false;

    const [modelName, field] = args.constraints as [T, ModelFields<T>];

    try {
      const prisma = DecoratorContextHost.getPrismaService();
      const client = prisma[modelName as string];

      if (!client || typeof client !== 'object') {
        throw new Error(`Invalid model: ${modelName}`);
      }

      const record = await (client as any).findFirst({
        where: { [field]: value },
      });

      return record !== null;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [modelName, field] = args.constraints as [T, ModelFields<T>];
    const propertyPath = this.getPropertyPath(args);
    return `${propertyPath}: ${String(field)} does not exist in ${String(
      modelName,
    )}`;
  }

  private getPropertyPath(args: ValidationArguments): string {
    const propertyName = args.property;
    const targetName = args.targetName;

    if (targetName && targetName !== 'Object') {
      return `${targetName}.${propertyName}`;
    }

    return propertyName;
  }
}

export function IsExist<T extends PrismaModels>(
  model: T,
  field: ModelFields<T>,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: IsExistConstraint,
    });
  };
}
