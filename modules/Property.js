'use strict';

class Property {
    constructor (required, defaultValue = null, allowedSet = null) {
        if (allowedSet !== null && !allowedSet instanceof Set) {
            throw 'Invalid argument error: 3. argument passed to Property::constructor must be NULL or instance of Set';
        }
        this.required = required;
        this.value = defaultValue;
        this.allowedSet = allowedSet instanceof Set && allowedSet.size === 0 ? null : allowedSet;
    }
    setValue (value) {
        value = value.toString();

        this.value = value;
    }
    getValue () {
        return this.value;
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
