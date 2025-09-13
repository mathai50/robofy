module.exports = {
  apps: [{
    name: 'robofy-api',
    script: 'venv/bin/python',
    args: '-m uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};