import zlib from 'zlib';
import fs from 'fs';

export const brotliify = (files: string[]) => {
	for (const file of files) {
		if (file.endsWith('.br')) continue;
		const inp = fs.createReadStream(file);
		const out = fs.createWriteStream(file + '.br');
		const brot = zlib.createBrotliCompress();
		inp.pipe(brot).pipe(out);
	}
};
