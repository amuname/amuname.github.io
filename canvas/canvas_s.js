'use strict'
let canvas = document.querySelector("body > canvas")

let img_dependensies = 1.5355089
let global_canvas_width = 1200

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

userInput.onchange = function(){
	console.log(this.files[0]) 
	const img = this.files[0]
	const inputImage = new Image()
	if (!img.type.startsWith('image/')|| img.name.endsWith('.tiff')) throw new TypeError('Wrong type of file')
	if (FileReader) {
        const fr = new FileReader()
        fr.onload = ()=> {
            inputImage.onload = function(){
            	const inputImageAspectRatio = this.width / this.height
            	let i =window.userImg = /*document.createElement('img')*/ new Image()
            	i.src = this.src
            	i.width = this.width
            	i.height = this.height
            	render({inputImage:i,inputImage_width:i.height,inputImage_height:i.width,first_time:true})
            }
            inputImage.src = fr.result
        }
        fr.readAsDataURL(img)
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

}


function reCount(inputImage,inputImage_width,inputImage_height,aspectRatio){
	console.time('reCount')
	// console.log(inputImage_width,inputImage_height)
	return new Promise((res,rej)=>{

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
        outputHeight = inputHeight / aspectRatio;
    }

            // рассчитать положение для рисования изображения в точке
    const outputX = (outputWidth - inputWidth) * .5;
	const outputY = (outputHeight - inputHeight) * .5;

            // создать холст, на котором будет представлено выходное изображение.
	const outputImage = canvas

            // установить его на тот же размер, что и изображение.
	outputImage.width = outputWidth;
	outputImage.height = outputHeight;


	if (inputImage.src == wood.src) {
		window.userImg = new Image()
		userImg.src = inputImage.src
        userImg.width = inputImage.width
        userImg.height = inputImage.height
		res({
			i:inputImage,
			dWidth:width_new_image,
			dHeight:width_new_image/aspectRatio
		})
	}

            // нарисуем наше изображение в точках 0, 0 на холсте.
	const ctx = outputImage.getContext('2d');
	ctx.drawImage(inputImage, outputX, outputY);
	const img = new Image(width_new_image,width_new_image/aspectRatio)
	const w_more_than_20_k = inputImage_width >2000 || inputImage_width >2000 ? 0.2 : 0.85
	img.src = outputImage.toDataURL("image/jpeg",w_more_than_20_k)
	// console.log(img)
	res( {
		i:img,
		// sx:0,
		// sy:0,
		// sWidth:0,
		// sHeight:0,
		dWidth:img.width,
		dHeight:img.height
	})
	console.timeEnd('reCount')

	})
}


function imageGenerator(
	canvas,slider_img,user_img,
	// sx,sy,
	// sWidth,sHeight,
	dx,dy,
	dWidth,dHeight,
	blink,color){
	console.time('imgGenerator')
	return new Promise((res,rej)=>{


	canvas.width = slider_img.width
	canvas.height = slider_img.height
	const ctx = canvas.getContext('2d')
	const ctx1 = canvas.getContext('2d')

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

	if(user_img){
		ctx.drawImage(
		user_img, // image
	 	dx, // dx
	 	dy, // dy
	 	dWidth, // dWidth
	 	dHeight // dHeight
	 	)
	} else {

	}

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
	console.log(scale)
	const diameter = scale*9
	const radius = diameter /2
	const offset = scale*35// radius
	const circle = 2 * Math.PI
	const bolt_dx_first = dx+offset - radius
	const bolt_dx_center = dx+dWidth/2-radius
	const bolt_dx_last = dx+dWidth-offset -radius
	const bolt_dy_top = dy+offset -radius
	const bolt_dy_bottom  = dy+dHeight-offset -radius

	ctx.shadowBlur = global_canvas_width/250

	ctx.drawImage(bolt,bolt_dx_first, bolt_dy_top, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_last, bolt_dy_top, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_first, bolt_dy_bottom, diameter,diameter)
	ctx.drawImage(bolt,bolt_dx_last, bolt_dy_bottom, diameter,diameter)
	if (scale<0.67) {
		ctx.drawImage(bolt,bolt_dx_center, bolt_dy_top, diameter,diameter)
		ctx.drawImage(bolt,bolt_dx_center, bolt_dy_bottom, diameter,diameter)

	}


	res()
	console.timeEnd('imgGenerator')

	})



}

async function render(args){
	console.time('render')
	
	if(!window.bg_d_l) window.bg_d_l = background_d
	if (!args.background_src) args.background_src = window.bg_d_l
	window.bg_d_l = args.background_src
	if(!window.w_h) window.w_h = 1.333
	if (!args.w_h) args.w_h = window.w_h
	window.w_h = args.w_h
	if(!window.default) window.default = '#1C76C2'
	if (!args.color) args.color = window.default
	window.default = args.color
	const sc = await reCount(args.inputImage,args.inputImage_width,args.inputImage_height,args.w_h)
	await imageGenerator(
		canvas,args.background_src,sc.i,
		// sc.sx,sc.sy,
		// sc.sWidth,sc.sHeight,
		parseFloat((args.background_src.width/2-sc.dWidth/2).toString().slice(0,4)),parseFloat((args.background_src.height/2-sc.dHeight/2).toString().slice(0,4)),
		sc.dWidth,sc.dHeight,
		blink,args.color)
	if (args.first_time==true) first_time.click()
	console.timeEnd('render')

}

window.onload = render.bind(this,
		{inputImage:wood,inputImage_width:wood.width,inputImage_height:wood.height,color:'#1C76C2'})
