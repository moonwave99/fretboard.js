const path = require('path');
const fs = require('fs-extra');
const { chunk } = require('lodash');
const marked = require('marked');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const jsonImporter = require('node-sass-json-importer');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const targetPath = path.resolve(__dirname, '_site');

const documentation = ['fretboard', 'musicTools'];
const examples = ['boxes', 'modes', 'chords', 'tetrachords', 'events'];

const labels = require('./site/data/labels.json');
const textsFile = fs.readFileSync('./site/data/texts.md', 'utf8');
const snippetsFile = fs.readFileSync('./site/data/snippets.md', 'utf8');
const docs = documentation.reduce((memo, key) => ({
  ...memo,
  [key]: marked(fs.readFileSync(`./site/data/documentation/${key}.md`, 'utf8'))
}), {});

const getTexts = (file) => {
  const tokens = file.split(/<!--([\s\S]*?)-->/g);
  tokens.shift();
  return chunk(tokens, 2).reduce(
    (memo, [key, value]) => ({ ...memo, [key]: marked(value) }), {}
  );
};

const { repository } = require('./package.json');

const getExampleLink = (example) => `${repository.url}/tree/master/site/scripts/examples/${example}.js`;

const capitalize = (string) => `${string[0].toUpperCase()}${string.substring(1)}`;

const partials = {
  footer: (footerClass = '') => {
    return `
      <footer class="container ${footerClass}">
        <p>&copy; 2020 <a href="${labels.links.author}">mwlabs</a>. | <a href="${labels.links.github}">github</a></p>
      </footer>`;
  },
  nav: (section) => {
    const isCurrent = (item) => {
      switch (item) {
        case 'examples':
          return examples.indexOf(section) > -1 ? 'is-current' : '';
        case 'documentation':
          return documentation.indexOf(section) > -1 ? 'is-current' : '';
        default:
          return section === item ? 'is-current' : '';
      }
    }

    const examplesEntries = [...examples, 'playback'].map(
      e =>`<a class="navbar-item ${isCurrent(e)}" href="examples-${e}.html">${capitalize(e)}</a>`
    ).join('\n');

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
          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link ${isCurrent('documentation')}">
              Documentation
            </span>

            <div class="navbar-dropdown">
              <a class="navbar-item ${isCurrent('fretboard')}" href="documentation-fretboard.html">Fretboard</a>
              <a class="navbar-item ${isCurrent('musicTools')}" href="documentation-music-tools.html">Music tools</a>
            </div>
          </div>

          <div class="navbar-item has-dropdown is-hoverable">
            <span class="navbar-link ${isCurrent('examples')}">
              Examples
            </span>
            <div class="navbar-dropdown">${examplesEntries}</div>
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

const templateParameters = {
  ...labels,
  partials,
  texts: getTexts(textsFile),
  snippets: getTexts(snippetsFile),
  getExampleLink,
  docs
};
const exampleEntries = examples.reduce(
  (memo, e) => ({ ...memo, [e]: `./site/scripts/${e}.js`})
  , {}
);

const examplePages = examples.map(e => {
  return new HtmlWebpackPlugin({
    title: `Fretboard.js | Examples | ${e[0].toUpperCase()}${e.substring(1)}`,
    filename: `examples-${e}.html`,
    template: `site/pages/examples/${e}.ejs`,
    inject: false,
    templateParameters
  });
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                importer: jsonImporter(),
              },
            },
          },
        ],
      },
    ],
  },
  entry: {
    index: "./site/scripts/index.js",
    playback: "./site/scripts/examples/playback.js",
  },
  output: {
    filename: "[name]-bundle.js",
    path: targetPath,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "site/assets", to: "assets" }],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      title: "Fretboard.js",
      filename: "index.html",
      template: "site/pages/index.ejs",
      inject: false,
      templateParameters,
    }),
    new HtmlWebpackPlugin({
      title: "Fretboard.js | Documentation | Fretboard",
      filename: "documentation-fretboard.html",
      template: "site/pages/documentation/fretboard.ejs",
      inject: false,
      templateParameters,
    }),
    new HtmlWebpackPlugin({
      title: "Fretboard.js | Documentation | Music Tools",
      filename: "documentation-music-tools.html",
      template: "site/pages/documentation/music-tools.ejs",
      inject: false,
      templateParameters,
    }),
    ...examplePages,
    new HtmlWebpackPlugin({
      title: "Fretboard.js | Examples | Playback",
      filename: "examples-playback.html",
      template: "site/pages/examples/playback.ejs",
      inject: false,
      templateParameters,
    }),
  ],
  devServer: {
    contentBase: targetPath,
    compress: true,
    port: 9000,
  },
};
