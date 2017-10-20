
const cp = require('child_process');
const nlane = require('../');


async function test1()
{
	// define `polaroid' function.
	function polaroid(src, dst)
	{
		return new Promise( (resolve,reject) => {
			cp.execFile(
				'convert', [src, '-background', '#cc0000', '-polaroid', '5', dst],
				(err, stdout, stderr) => {
					if (err) reject(err);
					else resolve();
			});
		});
	}

	// make narrow-laned function `nlpolaroid` from the `polaroid'.
	var lane = new nlane.lane(3);
	var nlpolaroid = lane.narrowifyPromised(polaroid);

	// call `nlpolaroid' fifteen times consecutively.
	var p = [];
	for ( i=0; i<15; i++ )
	{
		p.push( nlpolaroid("canvas.jpg", `polaroid${i}.jpg`) );
	}

	// wait all asynchronous process.
	try {
		await Promise.all(p);
		console.log(`finished. `);
	} catch (e) {
		console.log(`error. ${e}`);
	}
};

cp.execFile('convert',
	['-size', '1920x1080', 'xc:white', 'canvas.jpg'],
	(err,stdout,stderr) => {
		if(err) console.log('error: You have to install imagemagick for this example.');
		else test1();
	});

