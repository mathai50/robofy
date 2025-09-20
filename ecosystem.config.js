module.exports = {
  apps: [
    {
      name: "robofy-api",
      script: ".venv/bin/python",
      args: ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
      cwd: "./backend",
      env: {
        NODE_ENV: "development",
        PYTHONPATH: "."
      },
      watch: false,
      interpreter: "none",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      exec_mode: "fork",
      instances: 1
    }
  ]
};