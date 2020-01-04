import validator from 'validator';
import 'reflect-metadata';

type ValidationFunction = (target: any, propertyKey: string, validatorOptions?: any) => string | void;

interface ValidationRule {
    validationOptions?: any;
    validator: ValidationFunction;
}

/**
 * Function that validates the property input.
 * @param entity    The entity.
 */
const validate = (entity: any) => {
    const keys = Reflect.getMetadata('validation:properties', entity) as string[];
    const errorMap = {};

    if (!keys || !Array.isArray(keys)) {
        return errorMap;
    }

    for (const key of keys) {
        const rules: ValidationRule[] = Reflect.getMetadata('validation:rules', entity, key) as ValidationRule[];
        if (!Array.isArray(rules)) {
            continue;
        }
        for (const rule of rules) {
            const errorMessage = rule.validator(entity, key, rule.validationOptions);
            if (errorMessage) {
                errorMap[key] = errorMap[key] || [];
                errorMap[key].push(errorMessage);
            }
        }
    }

    return errorMap;
}

/**
 * Function that adds validation if the property exists in the meta data.
 * @param target                The target, i.e the entity.
 * @param propertyKey           The entity property to validate.
 * @param validator             The validator.
 * @param validationOptions     Optional. Options for the validator.
 */
const addValidation = (target: any, propertyKey: string, validator: ValidationFunction, validationOptions?: any) => {
    // Make sure we have the list of all properties for the object
    const objectProperties: string[] = Reflect.getMetadata('validation:properties', target) || [];
    if (!objectProperties.includes(propertyKey)) {
        objectProperties.push(propertyKey);
        Reflect.defineMetadata('validation:properties', objectProperties, target);
    }

    // Make sure we capture validation rule
    const validators: ValidationRule[] = Reflect.getMetadata('validation:rules', target, propertyKey) || [];
    const validationRule = {
        validator,
        validationOptions
    };
    validators.push(validationRule);
    Reflect.defineMetadata('validation:rules', validators, target, propertyKey);
}

/**
 * Validates the length of the property.
 * @param target            The target i.e. the entity.
 * @param propertyKey       The entity property to validate.
 * @param validatorOptions  Optional. Options for the validator.
 */
const lengthValidator = (target: any, propertyKey: string, validatorOptions: any): string | void => {
    const options = {
        min: validatorOptions.minimum,
        max: validatorOptions.maximum
    };
    const isValid = validator.isLength(target[propertyKey] + '', options);
    if (!isValid) {
        return `Property ${propertyKey} must be a string between ${validatorOptions.minimum} and ${validatorOptions.maximum} in length`;
    }
    return;
}

/**
 * Validates if a property is required or not.
 * @param target        The target i.e. The entity.
 * @param propertyKey   The entity property to validate.
 */
const requiredValidatior = (target: any, propertyKey: string): string | void => {
    const value = target[propertyKey];
    if (value) {
        return;
    }
    return `Property ${propertyKey} is required.`
}

/**
 * Validates a entity property as a number.
 * @param target                The target i.e. the entity.
 * @param propertyKey           The entity property.
 * @param validatorOptions      Optional. Options for the validator.
 */
const integerValidator = (target: any, propertyKey: string, validatorOptions: any): string | void => {
    const value = target[propertyKey];
    if (value == null) {
        return;
    }
    const errorMessage = `Property ${propertyKey} must be an integer between ${validatorOptions.minimum} and ${validatorOptions.maximum}`;
    if (!Number.isInteger(value)) {
        return errorMessage;
    }
    if (value <= validatorOptions.maximum && value >= validatorOptions.minimum) {
        return;
    }
    return errorMessage;
}

/**
 * Decorator. Makes a entity property as required.
 * @param target        The target i.e. The entity.
 * @param propertyKey   The entity propert.
 */
const required = (target: any, propertyKey: string) => {
    addValidation(target, propertyKey, requiredValidatior);
}

/**
 * Decorator. Sets the min and max length of a string property value.
 * @param minimum   The minimum amount of characters.
 * @param maximum   The maximum amount of characters.
 */
const length = (minimum: number, maximum: number) => {
    const options = {
        minimum,
        maximum
    };
    return (target: any, propertyKey: string) => {
        addValidation(target, propertyKey, lengthValidator, options);
    }
}

/**
 * Decorator. Validates that the property input is a number.
 * @param minimum   The minimum allowed number.
 * @param maximum   The maximum allowed number.
 */
const isInteger = (minimum: number, maximum: number) => {
    const options = {
        minimum,
        maximum
    };
    return (target: any, propertyKey: string) => {
        addValidation(target, propertyKey, integerValidator, options);
    }
}

export {
    required as Required,
    length as Length,
    isInteger as IsInteger,
    validate
}
