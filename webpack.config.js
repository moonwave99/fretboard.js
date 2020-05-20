const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const targetPath = path.resolve(__dirname, '_site');

const links = {
  github: 'https://github.com/moonwave99/fretboard.js',
  homepage: 'https://github.com/moonwave99/fretboard.js',
  author: 'https://www.diegocaponera.com'
};

const examples = ['boxes', 'playback', 'tetrachords'];

const partials = {
  footer: () => {
    return `
      <footer>
        <p>&copy; 2020 <a href="${links.author}">mwlabs</a>. | <a href="${links.github}">github</a></p>
      </footer>
    `;
  },
  nav: (section) => {
    const isCurrent = (item) => {
      if (item === 'examples') {
        return examples.indexOf(section) > -1 ? 'is-current' : '';
      }
      return section === item ? 'is-current' : '';
    }

    return `
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="index.html">
          <strong>Fretboard.js</strong>
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item ${isCurrent('documentation')}" href="documentation.html">Documentation</a>

          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link ${isCurrent('examples')}">
              Examples
            </span>

            <div class="navbar-dropdown">
              <a class="navbar-item ${isCurrent('boxes')}" href="boxes.html">Boxes</a>
              <a class="navbar-item ${isCurrent('tetrachords')}" href="tetrachords.html">Tetrachords</a>
              <a class="navbar-item ${isCurrent('playback')}" href="playback.html">Playback</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <a href="${links.github}">See on Github</a>
          </div>
        </div>
      </div>
    </nav>
    `;
  }
};

const templateParameters = { links, partials };

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  entry: {
    index: './site/scripts/index.js',
    documentation: './site/scripts/documentation.js',
    boxes: './site/scripts/boxes.js',
    tetrachords: './site/scripts/tetrachords.js',
    playback: './site/scripts/playback.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: targetPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Fretboard.js',
      filename: 'index.html',
      template: 'site/pages/index.ejs',
      inject: false,
      templateParameters
    }),
    new HtmlWebpackPlugin({
      title: 'Fretboard.js | Documentation',
      filename: 'documentation.html',
      template: 'site/pages/documentation.ejs',
      inject: false,
      templateParameters
    }),
    new HtmlWebpackPlugin({
      title: 'Fretboard.js | Examples | Boxes',
      filename: 'boxes.html',
      template: 'site/pages/boxes.ejs',
      inject: false,
      templateParameters
    }),
    new HtmlWebpackPlugin({
      title: 'Fretboard.js | Examples | Playback',
      filename: 'playback.html',
      template: 'site/pages/playback.ejs',
      inject: false,
      templateParameters
    }),
    new HtmlWebpackPlugin({
      title: 'Fretboard.js | Examples | Tetrachords',
      filename: 'tetrachords.html',
      template: 'site/pages/tetrachords.ejs',
      inject: false,
      templateParameters
    }),
  ],
  devServer: {
    contentBase: targetPath,
    compress: true,
    port: 9000
  },
};
