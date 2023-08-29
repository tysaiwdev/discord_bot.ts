import '$helpers/Environment.js';
import '$helpers/Command.js';
import '$helpers/Event.js';
// import '$structures/Sentry.js';

import { Tysaiw } from '$structures/Client.js';

const tysaiw = new Tysaiw();

tysaiw.sync()

export default tysaiw
