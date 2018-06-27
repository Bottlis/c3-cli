import path from 'path';
import fs from 'fs-extra';
import camelCase from 'camelcase';
import replace from 'replace-in-file';

import logger from './logger';

const templateDirPath = path.join(__dirname, 'template');

const types = {
  plugin: {
    name: 'plugin',
    sub: {
      single: {
        name: 'single-global',
        tmpDirName: 'singleGlobalPlugin'
      },
      drawing: {
        name: 'drawing',
        tmpDirName: 'drawingPlugin'
      },
      eText: {
        name: 'editor-text',
        tmpDirName: 'editorTextPlugin'
      }
    }
  },
  behavior: {
    name: 'behavior'
  },
  effect: {
    name: 'effect'
  },
  theme: {
    name: 'theme'
  }
}

/**
 * plugin  V1.4
 * behavior V1.2
 * effect V1.1
 * theme V1.0.1
 */

export default (prog) => {
  prog
    .command('create', 'Create an addon into a given directory')
    .argument('<type>', 'Addon type must be plugin|behavior|effect|theme', /^plugin|behavior|effect|theme$/)
    .argument('<id>', 'Addon id, Will be replaced automatically in the addon files', prog.STRING)
    .argument('<dir>', 'The directory where to create the Addon')
    .option('--plugin-type <plugintype>', 'Select a plugin type single-global|drawing|editor-text, type plugin ONLY!!', /^single-global|drawing|editor-text$/, 'single-global')

    .action((args, options) => {

      let tmpPath = null;

      if (args.type === types.plugin.name) {
        if (options.pluginType === types.plugin.sub.single.name) {
          tmpPath = path.join(templateDirPath, types.plugin.sub.single.tmpDirName);
        } else if (options.pluginType === types.plugin.sub.drawing.name) {
          tmpPath = path.join(templateDirPath, types.plugin.sub.drawing.tmpDirName);
        } else if (options.pluginType === types.plugin.sub.eText.name) {
          tmpPath = path.join(templateDirPath, types.plugin.sub.eText.tmpDirName);
        }
      } else if (args.type === types.behavior.name) {
        tmpPath = path.join(templateDirPath, types.behavior.name);
      } else if (args.type === types.effect.name) {
        tmpPath = path.join(templateDirPath, types.effect.name);
      } else if (args.type === types.theme.name) {
        tmpPath = path.join(templateDirPath, types.theme.name);
      }

      // Resolve the Dir path
      const dir = path.resolve(args.dir);

      // Check if the destination directory exists
      if (!fs.existsSync(dir)) {
        logger.error(`The destination directory "${dir}" does not exists`);
        return;
      }

      // Format the id name as CamelCase
      const id = camelCase(args.id);

      createAddon(id, tmpPath, dir);
    });
}

const createAddon = (id, tmpPath, destPath) => {
  // Create the destination folder of the addon
  const newAddonFolderPath = path.join(destPath, id);

  // Copy the template addon to the destination folder
  fs.copySync(tmpPath, newAddonFolderPath);

  // Replace the id in the new fresh addon copy
  replaceTheAddonIdAndClassName(id, newAddonFolderPath)
}

const replaceTheAddonIdAndClassName = (id, addonPath) => {
  const optionsMyCompany = {
    files: [
      path.join(addonPath, 'addon.json'),
      path.join(addonPath, 'c2runtime', 'runtime.js'),
      path.join(addonPath, 'c3runtime', 'actions.js'),
      path.join(addonPath, 'c3runtime', 'conditions.js'),
      path.join(addonPath, 'c3runtime', 'expressions.js'),
      path.join(addonPath, 'c3runtime', 'instance.js'),
      path.join(addonPath, 'c3runtime', 'plugin.js'),
      path.join(addonPath, 'c3runtime', 'behavior.js'),
      path.join(addonPath, 'c3runtime', 'type.js'),
      path.join(addonPath, 'instance.js'),
      path.join(addonPath, 'lang', 'en-US.json'),
      path.join(addonPath, 'plugin.js'),
      path.join(addonPath, 'behavior.js'),
      path.join(addonPath, 'type.js')
    ],
    from: [
      /MyCompany_SingleGlobal/gi,
      /MyCompany_DrawingPlugin/gi,
      /MyCompany_TextPlugin/gi,
      /MyCompany_CustomImporter/gi,
      /MyCompany_MyBehavior/gi,
      /MyCompany_MyEffect/gi,
      /MyCompany_Theme/gi
    ],
    to: id,
    allowEmptyPaths: true
  };

  const optionsMyCustom = {
    files: [
      path.join(addonPath, 'instance.js'),
      path.join(addonPath, 'plugin.js'),
      path.join(addonPath, 'behavior.js'),
      path.join(addonPath, 'type.js')
    ],
    from: [
      /class MyCustom/gi,
    ],
    to: `class ${camelCase(id, { pascalCase: true })}`,
    allowEmptyPaths: true
  };


  replace(optionsMyCompany).then((changes) => {
    return replace(optionsMyCustom)
  }).then(changes => {
    logger.info(`Your new addon is located here "${addonPath}"`);
  }).catch(error => {
    logger.error('Error occurred:', error);
  });
}




