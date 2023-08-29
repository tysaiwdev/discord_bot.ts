import { LunaryActivityType, LunaryIntentsBits, LunaryPartials } from '$types/tysaiw.js';

import { Client } from 'discordx';
import { GatewayIntentBits } from 'discord.js';
import { pino } from '$structures/Logger.js';

export class Tysaiw {
  protected token: string;
  protected intents!: Array<GatewayIntentBits>;
  public client: Client;

  constructor() {
      this.token = process.env['TOKEN_MAIN']!;
      // Log in the console
      pino.warn('‼ Loading in development mode');
      // Set Intents
      this.intents = LunaryIntentsBits.canary;
    

    this.client = new Client({
      // To use only guild command
      // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

      // Discord intents
      intents: this.intents,

      // Discord partials
      partials: LunaryPartials,

      // Bot Presence
      presence: {
        activities: [
          {
            name: 'Lunary Labs',
            type: LunaryActivityType.Watching
          }
        ],
        status: 'dnd'
      },

      // Other
      closeTimeout: 10,
      failIfNotExists: true,
      silent: true,
    });

    
  }

  sync() {
    this.client.login(this.token)
  }
}
