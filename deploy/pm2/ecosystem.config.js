module.exports = {
  // Applications part
  apps: [
    {
      name: "api",
      script: "./server/dist/main.js",
      env: {},
      // Environment variables injected when starting with --env production
      // http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
  // Deployment part
  // Here you describe each environment
  deploy: {
    production: {
      user: "yocco",
      // path to the public key to authenticate
      key: "~/.ssh/yocco.yocco",
      // Multi host is possible, just by passing IPs/hostname as an array
      host: ["206.54.191.61"],
      // Branch
      ref: "origin/feat/deploy",
      // Git repository to clone
      repo: "git@github.com:novikdev/yocco.git",
      // Path of the application on target servers
      path: "/data/yocco/api",
      // Commands to be executed on the server after the repo has been cloned
      "post-deploy":
        "chmod +x ./deploy/pm2/scripts/post-deploy.sh && ./deploy/pm2/scripts/post-deploy.sh",
      // Environment variables that must be injected in all applications on this env
      env: {
        APP_DIR: "/data/yocco",
        NODE_ENV: "production",
      },
      error_file: "/data/yocco/logs/pm2/err.log",
      out_file: "/data/yocco/logs/pm2/out.log",
    },
  },
};
