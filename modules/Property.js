'use strict';

class Property {
    constructor (required, defaultValue = null, allowedSet = null) {
        if (allowedSet !== null && !allowedSet instanceof Set) {
            throw 'Invalid argument error: 3. argument passed to Property::constructor must be NULL or instance of Set';
        }
        this.required = required;
        this.defaultValue = null === defaultValue ? null : defaultValue.toString();
        this.value = this.defaultValue;
        this.allowedSet = allowedSet instanceof Set && allowedSet.size === 0 ? null : allowedSet;
    }
    setValue (value) {
        value = value.toString();
        if (value === this.defaultValue) {
            throw `You cannot set same value as default value [${this.defaultValue} === ${value}]`;
        }
        this.value = value;
    }
    getValue (nullIfDefault = false) {
        return nullIfDefault && this.value === this.defaultValue
            ? null
            : this.value;
    }
    validate (properties = {}) {
        let value = this.getValue();
        let isRequired = typeof this.required === 'function'
            ? this.required(properties)
            : this.required;

        if (isRequired && value === null) {
            throw 'Missing value for property';
        }
        if (null !== this.allowedSet && !this.allowedSet.has(value)) {
            throw `Value ${value} is not allowed here`;
        }
    }
}

module.exports = Property;
