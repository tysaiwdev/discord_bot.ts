import { IResponse } from '$lib/commands/anime/IResponse.js';
import { AnimeType, getAnime } from '$plugins/Anime.js';
import {  ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import {  Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Anime {
  private res: AnimeType;
  private id: string;

  @Slash({
    name: 'anime',
    description: 'Diversão Explore animes',
    dmPermission: true
  })
  async Handler(
    @SlashOption({
      name: 'nome',
      description: 'R ‣ O anime na qual pesquisar',
      required: true,
      type: ApplicationCommandOptionType.String,

      autocomplete: async (interaction, command) => {
        // Get the user input
        const input = interaction.options.getFocused();

        // Make api query
        const animeData = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${input}`)
        const animeResponse: IResponse = await animeData.json()

        // Filter the response
        const filtered = animeResponse.data.filter((c) => c.attributes.titles.en)

        // Respond to the user
        await interaction.respond(
          filtered.map((choice) => ({
            name: choice.attributes.titles.en,
            value: choice.attributes.titles.en
          }))
        )
      }
    })
    anime: string,

    interaction: ChatInputCommandInteraction,
  ) {
    // Defer the reply to prevent timeout error's
    await interaction.deferReply({ ephemeral: true });

    // Set Response and ID
    this.res = await getAnime(anime);
    this.id = interaction.user.id


    // If the specified anime don't exist
    if (!this.res) {
      // Not Found Embed
      const notFoundEmbed = new EmbedBuilder()
        .setTitle('Não encontrado!')
        .setDescription('Não encontrei nenhum anime!')
        .setColor('Red');

      // Reply's to the user
      await interaction.editReply({ embeds: [notFoundEmbed] });
      return;
    }


    // Button Row
    const embed = new EmbedBuilder()
      .setTitle(`${this.res.title} [${this.res.rating}]`)
      .setDescription(this.res.synopsis)
      .setColor('Blurple')
      .setImage(this.res.image);

    // Reply's to the user
    await interaction.editReply({ embeds: [embed] });
  }

}
