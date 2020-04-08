'use strict';

class Original extends require('./abstract-modifier') {
    constructor(alias = 'original') {
        super(alias);
    }
}

module.exports = Original;
