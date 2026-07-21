import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          register: path.resolve(__dirname, 'applicant-register.html'),
          login: path.resolve(__dirname, 'applicant-login.html'),
          forgotPassword: path.resolve(__dirname, 'forgot-password.html'),
          dashboard: path.resolve(__dirname, 'applicant-dashboard.html'),
          application: path.resolve(__dirname, 'admission-application.html'),
          review: path.resolve(__dirname, 'application-review.html'),
          adminReview: path.resolve(__dirname, 'admin-admission-review.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
