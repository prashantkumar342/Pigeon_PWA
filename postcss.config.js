// postcss.config.js

import postcssImport from 'postcss-import';
import postcssSimpleVars from 'postcss-simple-vars';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssImport,
    postcssSimpleVars({
      variables: () => ({
        'primary-color': '#AD49E1',
        'secondary-color': '#25D366',
      }),
    }),
    tailwindcss,
    autoprefixer,
  ],
};
