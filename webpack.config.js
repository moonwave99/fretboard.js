const path = require('path');
const fs = require('fs-extra');
const { chunk } = require('lodash');
const marked = require('marked');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const labels = require('./site/labels.json');
const textsFile = fs.readFileSync('./site/texts.md', 'utf8');
const docsFile = fs.readFileSync('./site/documentation.md', 'utf8');

const targetPath = path.resolve(__dirname, '_site');
const examples = ['boxes', 'playback', 'tetrachords'];

const getTexts = () => {
  const tokens = textsFile.split(/<!--([\s\S]*?)-->/g);
  tokens.shift();
  return chunk(tokens, 2).reduce(
    (memo, [key, value]) => ({ ...memo, [key]: marked(value) }), {}
  );
};

const documentation = marked(docsFile);

const partials = {
  footer: () => {
    return `
      <footer class="container">
        <p>&copy; 2020 <a href="${labels.links.author}">mwlabs</a>. | <a href="${labels.links.github}">github</a></p>
      </footer>`;
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
          <span class="navbar-icon" id="icon" title="I am client generated as well of course!"></span>
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
            <a href="${labels.links.github}">See on Github</a>
          </div>
        </div>
      </div>
    </nav>
    `;
  }
};

const templateParameters = { ...labels, partials, texts: getTexts(), documentation };
const exampleEntries = examples.reduce(
  (memo, e) => ({ ...memo, [e]: `./site/scripts/${e}.js`})
  , {}
);

const examplePages = examples.map(e => {
  return new HtmlWebpackPlugin({
    title: `Fretboard.js | Examples | ${e[0].toUpperCase()}${e.substring(1)}`,
    filename: `${e}.html`,
    template: `site/pages/${e}.ejs`,
    inject: false,
    templateParameters
  });
});

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
    ...exampleEntries
  },
  output: {
    filename: '[name]-bundle.js',
    path: targetPath,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'site/assets', to: 'assets' }
      ]
    }),
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
    ...examplePages
  ],
  devServer: {
    contentBase: targetPath,
    compress: true,
    port: 9000
  },
};
