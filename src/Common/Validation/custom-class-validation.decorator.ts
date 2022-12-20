import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

//* custom class validator decorators

//* to check current field value equal to given field value in same object - decorator factory
export function IsEqualTo(field: string, validationOptions: ValidationOptions) {
  return function (object: object, propertyName: string) {
    //* registering custom decorator to global class validator decorator
    registerDecorator({
      name: 'isEqualTo', //* name of the validator decorator
      propertyName: propertyName, //* name of the current class field or property name
      target: object.constructor, //* current class constructor
      constraints: [field], //* destination field name
      options: validationOptions, //* class-validator options
      validator: {
        //*validator function
        validate(value: any, args: ValidationArguments): boolean {
          //* value current property value , args - entire object
          const [relatedPropertyName] = args.constraints; //* destination field/property name
          const relatedValue = args.object[relatedPropertyName]; //* destination field/property value
          return value === relatedValue; //* check if current field/property value equal to destination field/property value
        },
      },
    });
  };
}
