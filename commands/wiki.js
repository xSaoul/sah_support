const { CommandBuilder } = require('shardclient');

module.exports = new CommandBuilder()
  .setName('wiki')
  .setDescription('Searches the wiki')
  .addStringOption(option => option.setName('query').setDescription('What are you looking for?').setAutocomplete(true).setRequired(true))
  .addUserOption(option => option.setName('target').setDescription('Select a user to direct to the wiki').setRequired(false))
  .setAutoCallback(async ctx => {
    const focused = ctx.interaction.options.getFocused();
    const paths = [
      'AirVPN',
      'bazarr',
      'blog',
      'cloudflareddns',
      'CloudflareTunnels',
      'discord',
      'Docker',
      'Dockge',
      'donate',
      'dozzle',
      'Emby',
      'Flaresolverr',
      'Folder-Structure',
      'ghost',
      'github',
      'gluetun',
      'gotify',
      'home',
      'InstallInstructions',
      'Jellyseerr',
      'nextcloud',
      'nginx',
      'Notifications',
      'OverviewMap',
      'Portainer',
      'Prowlarr',
      'Proxmox',
      'qBittorrent',
      'ravencentric',
      'radarr',
      'Recyclarr',
      'Remote-Management',
      'Sonarr',
      'TrueNAS',
      'umami',
      'Unpackerr',
      'Kuma',
      'vaultwarden',
      'Watchtower',
      'webmin',
      'wikijs',
      'Wireguard-UI',
      'wordpress',
      'youtube',
      'wg-easy',
    ];

    const filtered = focused ? paths.filter(path => path.toLowerCase().startsWith(focused.toLowerCase())) : paths.slice(0, 25);
    await ctx.interaction.respond(filtered.map(path => ({ name: path, value: path })));
  })
  .setCallback(ctx => {
    const query = ctx.interaction.options.getString('query');
    const target = ctx.interaction.options.getUser('target');
    const targetString = target ? `${target} check out this wiki entry!\n` : 'Check out this wiki entry!\n';
    const wikiUrl = `https://wiki.serversatho.me/en/${query}`;
    ctx.interaction.reply({ content: `${targetString}${wikiUrl}` });
  });
