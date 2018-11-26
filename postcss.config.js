/*!
 * postcss config
 * xiekai <xk285985285@.qq.com>
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';

const path = require('path');

module.exports = {
	plugins: [
		require('autoprefixer'),
		require('postcss-sprites')({
			retina: true,
			spritePath: './src/images/',
			filterBy(image) {
				let reg = new RegExp(`\\${path.sep}images\\${path.sep}([^\\${path.sep}]+)\\${path.sep}[^\\${path.sep}]+\.[^\\${path.sep}]+$`, "i");
				let group = reg.exec(image.path);
				return Promise[group ? 'resolve' : 'reject']();
			},
			groupBy(image) {
				let reg = new RegExp(`\\${path.sep}images\\${path.sep}([^\\${path.sep}]+)\\${path.sep}[^\\${path.sep}]+\.[^\\${path.sep}]+$`, "i");
				let group = reg.exec(image.path);

				return group ? Promise.resolve(group[1]) : Promise.reject();
			},
			hooks: {
				onSaveSpritesheet(opts, spritesheet) {
					return path.join(opts.spritePath, `${spritesheet.groups.reverse().join('')}.${spritesheet.extension}`);
				},
			},
		}),
	],
};
