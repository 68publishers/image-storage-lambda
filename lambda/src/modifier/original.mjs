import { AbstractModifier } from './abstract-modifier.mjs';

export class Original extends AbstractModifier {
    constructor(alias = 'original') {
        super(alias);
    }
}
