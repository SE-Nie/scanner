import './styles.css';
import cv from 'opencv.js';

// static test image things
const img = document.querySelector('img');
const staticCanvasElement = document.getElementById('staticCanvas');
const staticCanvas = staticCanvasElement.getContext('2d');

// grab image tag, put its data onto the static canvas

staticCanvasElement.width = img.width / 8;
staticCanvasElement.height = img.height / 8;
staticCanvas.drawImage(
	img,
	0,
	0,
	img.width,
	img.height,
	0,
	0,
	img.width / 8,
	img.height / 8
);
// you can use this staticTestImage variable to give to your model
const staticTestImageData = staticCanvas.getImageData(
	0,
	0,
	staticCanvasElement.width,
	staticCanvasElement.height
);

const results = fakeModelThing(staticCanvasElement);
// and draw contours for example

function fakeModelThing(imageData) {
	let src = cv.imread(imageData);
	let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
	cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
	cv.medianBlur(src, src, 5);
	cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();
	// You can try more different parameters
	cv.findContours(
		src,
		contours,
		hierarchy,
		cv.RETR_CCOMP,
		cv.CHAIN_APPROX_SIMPLE
	);
	// draw contours with random Scalar
	for (let i = 0; i < contours.size(); ++i) {
		let color = new cv.Scalar(
			Math.round(Math.random() * 255),
			Math.round(Math.random() * 255),
			Math.round(Math.random() * 255)
		);
		cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
	}
	cv.imshow('canvasOutput', dst);
	src.delete();
	dst.delete();
	contours.delete();
	hierarchy.delete();
}
