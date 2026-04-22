// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'ai-boost',
      script: './dist/server/entry.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        HOST: '127.0.0.1',
        PORT: 4321,
        NODE_ENV: 'production',
      },
    },
  ],
};
