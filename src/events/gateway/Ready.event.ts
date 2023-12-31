import { ArgsOf, Client, Discord, Once } from 'discordx';

//import { pClient } from '$database/Prisma.js';
import { pino } from '$structures/Logger.js';
import { sentry } from '$structures/Sentry.js';

@Discord()
export abstract class Ready {
  @Once({ event: 'ready' })
  async Handle([_]: ArgsOf<'ready'>, client: Client) {
    // Make sure all guilds are cached
    this.syncGuilds(client);

    // Synchronize applications commands with Discord
    this.syncCommands(client);

    // Clear Commands
    // this.clearCommands(client);

    // Connect to database
    // this.databaseConnect();

    // When connected
    pino.info(`✓ Connected to the gateway as ${client.user?.tag}`);
  }

  // Sync Guilds
  syncGuilds(client: Client) {
    // WARN
    pino.warn('‼ Synchronizing guilds...');

    // Fetch Guilds
    client.guilds.fetch()
      .then(() => pino.info('✓ Synchronized guilds...'))
      .catch((err: unknown) => {
        pino.error('✕ Error when synchronizing guilds...', err);
        sentry.captureException(err);
      });
  }

  // Sync Commands
  syncCommands(client: Client) {
    // WARN
    pino.warn('‼ Synchronizing global commands...');

    // Init App Commands Guilds
    client.initApplicationCommands()
      .then(() => pino.info('✓ Synchronized global commands...'))
      .catch((err: unknown) => {
        pino.error('✕ Error when synchronizing global commands...', err);
        sentry.captureException(err);
      });
  }

  async clearCommands(client: Client) {
    // Clear Application Commands
    await client.clearApplicationCommands(...client.guilds.cache.map((g) => g.id));
  }

  // async databaseConnect() {
  //   // WARN
  //   pino.warn('‼ Connecting to Database')

  //   // Init App Commands Guilds
  //   await pClient.$connect()
  //     .then(() => pino.info('✓ Connected to Database...'))
  //     .catch((err: unknown) => {
  //       pino.error('✕ Error when connecting to Database', err);
  //       sentry.captureException(err);
  //     });
  // }
}
