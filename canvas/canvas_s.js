'use strict'
let canvas = document.getElementsByTagName("canvas")[0]

let img_dependensies = 1.5
let global_canvas_width = 1920

let background_l = new Image(global_canvas_width,global_canvas_width/img_dependensies)
background_l.src = './light.jpg'
let background_d = new Image(global_canvas_width,global_canvas_width/img_dependensies)
background_d.src = './dark.jpg'
let blink = new Image()
blink.src = './blik.png'
let bolt = new Image()
bolt.src = './bolt.png'
let wood = new Image(260,200)
wood.src = './wood.jpg'
let userInput = document.getElementsByName('userImg')[0]
const first_time = document.getElementById('first_time')
const loader = document.getElementById('loader')

userInput.onchange = function(){
	const img = this.files[0]
	window.userImg = new Image()
	if (!img.type.startsWith('image/')|| img.name.endsWith('.tiff') || img.type == undefined) {
		wrongTypeOfFile()
		return
	}
	if (img.size> 8588608) {
		largeImage()
		return
	}
	if (FileReader) {
        const fr = new FileReader()
        fr.onload = ()=> {
            window.userImg.onload = function(){
            	const inputImageAspectRatio = this.width / this.height
            	window.userImg.width = this.width
            	window.userImg.height = this.height
            	render({inputImage:window.userImg,inputImage_width:window.userImg.width,inputImage_height:window.userImg.height,first_time:true})
            }
            window.userImg.src = fr.result
        }
        fr.readAsDataURL(img)
    }

    // Not supported
    else {
        // callback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

}


function reCount(inputImage,inputImage_width,inputImage_height,aspectRatio){
	// console.log(inputImage_width,inputImage_height)
	return new Promise((res,rej)=>{
	console.time('reCount')

	let width_new_image = global_canvas_width/3
	if(aspectRatio== 1) width_new_image = global_canvas_width/2.96 
	if(aspectRatio== 1.5) width_new_image = global_canvas_width/1.9

	// давайте сохраним ширину и высоту нашего изображения.
    const inputWidth = inputImage_width;
    const inputHeight = inputImage_height;

            // получить соотношение сторон входного изображения
    const inputImageAspectRatio = inputWidth / inputHeight;

            // если он больше, чем целевой коэффициент соотношения сторон.
    let outputWidth = inputWidth;
    let outputHeight = inputHeight;

    if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
    } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = outputWidth / aspectRatio;
    }

            // рассчитать положение для рисования изображения в точке
    const outputX = (outputWidth - inputWidth) * .5;
	const outputY = (outputHeight - inputHeight) * .5;

            // создать холст, на котором будет представлено выходное изображение.
	const outputImage = document.createElement('canvas');

            // установить его на тот же размер, что и изображение.
	outputImage.width = outputWidth;
	outputImage.height = outputHeight;


	if (inputImage.src == wood.src) {
		window.userImg = new Image()
		userImg.src = inputImage.src
        userImg.width = inputImage.width
        userImg.height = inputImage.height
        console.timeEnd('reCount')
		res({
			i:inputImage,
			dWidth:width_new_image,
			dHeight:width_new_image/aspectRatio
		})
	}

            // нарисуем наше изображение в точках 0, 0 на холсте.
	const ctx = outputImage.getContext('2d');
	ctx.drawImage(inputImage, outputX, outputY);
	console.timeEnd('reCount')
	res( {
		i:outputImage,
		dWidth:width_new_image,
		dHeight:width_new_image/aspectRatio
	})
	

	})
}


function imageGenerator(
	canvas,slider_img,user_img,
	dx,dy,
	dWidth,dHeight,
	blink,color){
	console.time('imgGenerator')
	return new Promise((res,rej)=>{


	canvas.width = slider_img.width
	canvas.height = slider_img.height
	const ctx = canvas.getContext('2d')
	// const ctx1 = canvas.getContext('2d')

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.drawImage(slider_img,0,0,canvas.width,canvas.height)
	
	ctx.shadowColor = '#232425'
	ctx.shadowBlur = global_canvas_width/32

	ctx.fillStyle = '#ffffff'
	ctx.fillRect(dx,dy,dWidth,dHeight)

	ctx.shadowColor = color
	ctx.shadowBlur = global_canvas_width/53.33

	ctx.fillStyle = '#ffffff'
	ctx.fillRect(dx,dy,dWidth,dHeight)

		// ctx.shadowColor = 'green'
	ctx.shadowOffsetY = global_canvas_width/160
	ctx.shadowOffsetX = global_canvas_width/160
	ctx.shadowBlur = global_canvas_width/53.33
		// ctx.fillStyle = '#7fffd40f'
	ctx.fillRect(dx,dy,dWidth,dHeight)

	ctx.shadowOffsetY = 0
	ctx.shadowOffsetX = 0
	ctx.shadowBlur = 0

	if(!user_img) user_img = wood
	
	ctx.drawImage(
		user_img, // image
		dx, // dx
		dy, // dy
		dWidth, // dWidth
		dHeight // dHeight
	)


	ctx.shadowOffsetY = 0
	ctx.shadowOffsetX = 0
	ctx.shadowBlur = 0
	ctx.drawImage(
		blink, // image
	 	dx, 
	 	dy, 
	 	dWidth, 
	 	dHeight 
	 	)


	const scale = dWidth / dHeight == 1 ? 0.7 : dHeight/dWidth
	// console.log(scale)
	const diameter = scale*9
	const radius = diameter /2
	const offset = scale*35// radius
	const circle = 2 * Math.PI
	const bolt_dx_first = dx+offset - radius
	const bolt_dx_center = dx+dWidth/2-radius
	const bolt_dx_last = dx+dWidth-offset -radius
	const bolt_dy_top = dy+offset -radius
	const bolt_dy_bottom  = dy+dHeight-offset -radius

	ctx.drawImage(bolt,bolt_dx_first, bolt_dy_top, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_last, bolt_dy_top, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_first, bolt_dy_bottom, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_last, bolt_dy_bottom, diameter,diameter)
	if (scale<0.67) {
		ctx.drawImage(bolt,bolt_dx_center, bolt_dy_top, diameter,diameter)
		ctx.drawImage(bolt,bolt_dx_center, bolt_dy_bottom, diameter,diameter)

	}

	console.timeEnd('imgGenerator')
	res()

	})



}

async function render(args){
	console.time('render')

	// canvas.width = global_canvas_width
	// canvas.height = global_canvas_width/img_dependensies
	if(!window.bg_d_l) window.bg_d_l = background_d
	if (!args.background_src) args.background_src = window.bg_d_l
	window.bg_d_l = args.background_src
	if(!window.w_h) window.w_h = 1.333
	if (!args.w_h) args.w_h = window.w_h
	window.w_h = args.w_h
	if(!window.default) window.default = '#1C76C2'
	if (!args.color) args.color = window.default
	window.default = args.color
	let sc = await reCount(args.inputImage,args.inputImage_width,args.inputImage_height,args.w_h)

	await imageGenerator(
		canvas,args.background_src,sc.i,
		// sc.sx,sc.sy,
		// sc.sWidth,sc.sHeight,
		parseFloat((args.background_src.width/2-sc.dWidth/2).toString().slice(0,4)),parseFloat((args.background_src.height/2-sc.dHeight/2).toString().slice(0,4)),
		sc.dWidth,sc.dHeight,
		blink,args.color)

	console.timeEnd('render')

	if (args.rgb) {
		window.last_timeout = setTimeout(intervalRgbBlinking,args.rgb)
	} else {
		window.rgb_is_registred = false
		clearTimeout(window.last_timeout)
	}
}

window.onload = render.bind(this,
		{inputImage:wood,inputImage_width:260,inputImage_height:200,color:'#1C76C2'})

document.addEventListener('rgb-start',intervalRgbBlinking)

async function intervalRgbBlinking(e){
	const set_of_colors = [
	'#ff0000',//
	'#f22f00', '#e54200', '#d94f00',
	'#cd5800',//
	'#be6100', '#b06800', '#a26e00',
	'#957200',//
	'#887500', '#7a7800', '#6b7b00',
	'#5b7d00',//
	'#4e7e00', '#3f7f00', '#2b7f00',
	'#008000',//
	'#008128', '#00813f', '#008151',
	'#00805f',//
	'#008480', '#0085a3', '#0082be',
	'#007bcc',//
	'#0079db', '#0075e8', '#0071f4',
	'#006bff',//
	'#005bff', '#0049ff', '#0031ff',
	'#0000ff',//
	'#7100ee', '#9800df', '#b200d0',
	'#c500c3',//
	'#d900b2', '#e800a1', '#f30090',
	'#fb0080',//
	'#fe0072', '#ff0063', '#ff0054',
	'#ff0045',//
	]
		
	window.next_rgb_color = window.next_rgb_color>= set_of_colors.length ? 0 : window.next_rgb_color+1 || 0
	const next_color_rgb = set_of_colors[window.next_rgb_color]

	if (window.rgb_is_registred && e?.type=='rgb-start') return
	window.rgb_is_registred = true
	await render({inputImage:window.userImg,inputImage_width:window.userImg.width,inputImage_height:window.userImg.height,color:next_color_rgb,rgb:100})
		
}


async function download() {
	const a = document.createElement('a')
	a.setAttribute('download', 'previev.jpg');
  	a.setAttribute('href', canvas.toDataURL("image/jpg"))
	a.click()	
}

function largeImage(){
	if (t390_showPopup) t390_showPopup('338070912')
	return
}
function wrongTypeOfFile(){
	if (t390_showPopup) t390_showPopup('338061931')
	return
}
