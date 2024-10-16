import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src', // Le dossier où se trouve votre index.html
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Répertoire de sortie pour la build
  },
  server: {
    port: 3000, // Port du serveur de développement
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias pour le dossier src
    },
  },
});
