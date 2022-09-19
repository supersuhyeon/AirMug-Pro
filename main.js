(()=>{
    
    let yOffset = 0; //window.pageYoffset 대신 쓸 변수
    let prevScrollHeight = 0; //현재 스크롤 위치 (yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
    let currentScene = 0; //현재 활성화된(눈앞에 보고있는) 장면
    let enterNewScene = false; //새로운 씬이 시작되는순간 true/false로 마이너스 값 막기

    let acc = 0.1; //가속도
    let delayedYOffset = 0; //목표지점
    let rafId;
    let rafState;

    //1. make an array for including each section's information of animation (4 objects = total 4 sections)
    const sceneInfo = [
        {
            //scroll-section 0
            type: 'sticky',
            heightNum: 5, //브라우저 높이의 5배로 scroll height 세팅
            scrollHeight : 0, //애니메이션 되는 구간
            objs: {
                //html 객체 모으기
                container: document.querySelector('#scroll-section-0'),
                messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                messageD : document.querySelector('#scroll-section-0 .main-message.d'),

                //canvas video
                canvas: document.querySelector('#video-canvas-0'),
                context : document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages : [],
            },
            values: {
                //opacity 0에서 시작해서 1로 끝, opacity 애니메이션 시작과 끝구간 0.1,0.2 (전체 스크롤 값을 0-1로봄)
                messageA_opacity_in : [0,1,{start: 0.1,end : 0.2,}], 
                messageA_opacity_out : [1,0,{start: 0.25,end : 0.3,}], 
                messageA_translateY_in : [20,0,{start: 0.1,end : 0.2,}],
                messageA_translateY_out : [0,-20,{start: 0.25,end : 0.3,}],

                messageB_opacity_in : [0,1,{start: 0.3,end : 0.4,}],
                messageB_opacity_out : [1,0,{start: 0.45,end : 0.5,}],
                messageB_translateY_in : [20,0,{start: 0.3,end : 0.4,}],
                messageB_translateY_out : [0,-20,{start: 0.45,end : 0.5,}],

                messageC_opacity_in : [0,1,{start: 0.5,end : 0.6,}],
                messageC_opacity_out : [1,0,{start: 0.65,end : 0.7,}],
                messageC_translateY_in : [20,0,{start: 0.5,end : 0.6,}],
                messageC_translateY_out : [0,-20,{start: 0.65,end : 0.7,}],

                messageD_opacity_in : [0,1,{start: 0.7,end : 0.8,}],
                messageD_opacity_out : [1,0,{start: 0.85,end : 0.9,}],
                messageD_translateY_in : [20,0,{start: 0.7,end : 0.8,}],
                messageD_translateY_out : [0,-20,{start: 0.85,end : 0.9,}],

                videoImageCount: 300, 
                imageSequence: [0,299], 
                canvas_opacity :[1,0,{start : 0.9, end: 1}]
            }
        },
        {
            //scroll-section 1
            type: 'normal', //일반스크롤구간
            heightNum: 0, 
            scrollHeight : 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            },
        },
        {
            //scroll-section 2
            type:'sticky',
            heightNum: 5,
            scrollHeight : 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                mainMessageA : document.querySelector('#scroll-section-2 .main-message.a'),
                descMessageB : document.querySelector('#scroll-section-2 .desc-message.b'),
                descMessageC : document.querySelector('#scroll-section-2 .desc-message.c'),

                canvas: document.querySelector('#video-canvas-1'),
                context : document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages : [],
            },
            values: {
                mainMessageA_opacity_in : [0,1,{start: 0.1,end : 0.2,}], 
                mainMessageA_opacity_out : [1,0,{start: 0.25,end : 0.3,}], 
                mainMessageA_translateY_in : [20,0,{start: 0.1,end : 0.2,}],
                mainMessageA_translateY_out : [0,-20,{start: 0.25,end : 0.3,}],

                descMessageB_opacity_in : [0,1,{start: 0.5,end : 0.6,}],
                descMessageB_opacity_out : [1,0,{start: 0.65,end : 0.7,}],
                descMessageB_translateY_in : [20,0,{start: 0.5,end : 0.6,}],
                descMessageB_translateY_out : [0,-20,{start: 0.65,end : 0.7,}],

                descMessageC_opacity_in : [0,1,{start: 0.75,end : 0.85,}],
                descMessageC_opacity_out : [1,0,{start: 0.9,end : 0.95,}],
                descMessageC_translateY_in : [20,0,{start: 0.75,end : 0.85,}],
                descMessageC_translateY_out : [0,-20,{start: 0.9,end : 0.95,}],

                videoImageCount: 960, //이미지 총개수
                imageSequence: [0,959], //이미지 순서
                canvas_opacity_in :[0,1,{start : 0, end: 0.1}],
                canvas_opacity_out :[1,0,{start : 0.95, end: 1}]
            }
        },
        {
            //scroll-section 3
            type:'sticky',
            heightNum: 5, 
            scrollHeight : 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption : document.querySelector('.canvas-caption'),
                canvas : document.querySelector('.image-blend-canvas'),
                context : document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath : [
                    './images/cup1.jpg',
                    './images/cup2.jpg',
                ],
                images: []

            },
            values:{
                rect1X : [0,0,{start: 0, end:0}],
                rect2X : [0,0,{start :0, end : 0}],
                rectStartY: 0, //기준점
                canvas_scale : [0,0,{start:0,end:0}],
                blendHeight : [0,0,{start:0,end:0}],
                canvasCaption_opacity : [0,1,{start:0,end:0}],
                canvasCaption_translateY : [20,0,{start:0,end:0}]
            }
        },
    ];


    function setCanvasImages(){
        let imgElem;
        for (let i = 0; i<sceneInfo[0].values.videoImageCount; i++){ 
            imgElem = document.createElement('img') //new Image()
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`
            sceneInfo[0].objs.videoImages.push(imgElem)
        }

        let imgElem2;
        for (let i = 0; i<sceneInfo[2].values.videoImageCount; i++){ //videoImageCount = 960;
            imgElem2 = document.createElement('img') //new Image()
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`
            sceneInfo[2].objs.videoImages.push(imgElem2)
        }

        let imgElem3
        for(let i=0; i<sceneInfo[3].objs.imagesPath.length; i++){
            imgElem3 = document.createElement('img') //new Image()
            imgElem3.src = sceneInfo[3].objs.imagesPath[i]
            sceneInfo[3].objs.images.push(imgElem3)
        }
        console.log(sceneInfo[3].objs.images)
    }

   

    function checkMenu(){
        //yOffset = window.pageYoffset 현재 스크롤된 위치
        if(yOffset > 44){
            document.body.classList.add('local-nav-sticky')
        }else{
            document.body.classList.remove('local-nav-sticky')
        }
    }


    function calcValues(values, currentYoffset){
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        const scrollRatio = currentYoffset/ scrollHeight; //현재 씬(스크롤섹션)에서 스크롤된 범위 비율로 구하기
        

        if(values.length === 3){
            // 스크롤섹션 총 시작과 끝값이 아닌 위에 명시한 start~~~end 값 그 사이의 애니메이션 실행 분기처리.
            const partScrollStart = values[2].start * scrollHeight //0.1 * 4170 = 417
            const partScrollEnd = values[2].end * scrollHeight //0.17 * 4170 = 748
            const partScrollHeight = partScrollEnd - partScrollStart // = 331
            
            if(currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd){ 
                //partscrollheight에 value 1,0을 곱해주는 이유는 애니메이션이 실행될 구간을 애니메이션을 실행할 최초값과 마지막값으로 세팅해주기위함.
               //사용자의 스크롤이 partscrollheight 구간에 들어오게되면 0.0001~0.999까지 범위가 생기는데 그 곳을 애니메이션 실행값으로 곱해서(변경해서) 
               //최종 rv를 캔버스로 그리거나 css style값에 할당해서 스크롤될때 애니메이션이 그 값으로 실행되도록함. rv는 곧 애니메이션 값이다.
                rv =  (currentYoffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0] //1=46,0=257

            }else if(currentYoffset < partScrollStart){
                rv=values[0]
            }else if(currentYoffset > partScrollEnd){
                rv=values[1]
            }
        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0] //원하는 범위값 start/end값으로 맞추기
        }
         
        return rv
    }

    function playAnimation(){ //구간안에서의 애니메이션 처리
        const objs = sceneInfo[currentScene].objs
        const values = sceneInfo[currentScene].values
        const currentYoffset = yOffset - prevScrollHeight; //현재씬의 이전 높이값에서 현재 스크롤 위치를 뺀것
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        const scrollRatio = currentYoffset / scrollHeight

        switch (currentScene){
            case 0:
            if(scrollRatio <= 0.22 ){
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYoffset)
                objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYoffset)}%)`
            }else{
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYoffset)
                objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYoffset)}%)`
            }

            if(scrollRatio <= 0.42){
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYoffset)
                objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_in, currentYoffset)}%)`
            }else{
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYoffset)
                objs.messageB.style.transform = `translateY(${calcValues(values.messageB_translateY_out, currentYoffset)}%)`
            }

            if(scrollRatio <= 0.62){
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYoffset)
                objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_in, currentYoffset)}%)`
            }else{
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYoffset)
                objs.messageC.style.transform = `translateY(${calcValues(values.messageC_translateY_out, currentYoffset)}%)`
            }

            if(scrollRatio <= 0.82){
                objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYoffset)
                objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_in, currentYoffset)}%)`
            }else{
                objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYoffset)
                objs.messageD.style.transform = `translateY(${calcValues(values.messageD_translateY_out, currentYoffset)}%)`
            }

            //background canvas video
            // let sequence = Math.round(calcValues(values.imageSequence, currentYoffset))
            // objs.context.drawImage(objs.videoImages[sequence],0,0)
            objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYoffset)
                break;

            case 2:
                if(scrollRatio <= 0.22 ){
                    objs.mainMessageA.style.opacity = calcValues(values.mainMessageA_opacity_in, currentYoffset)
                    objs.mainMessageA.style.transform = `translateY(${calcValues(values.mainMessageA_translateY_in, currentYoffset)}%)`
                }else{
                    objs.mainMessageA.style.opacity = calcValues(values.mainMessageA_opacity_out, currentYoffset)
                    objs.mainMessageA.style.transform = `translateY(${calcValues(values.mainMessageA_translateY_out, currentYoffset)}%)`
                }

                if(scrollRatio <= 0.62){
                    objs.descMessageB.style.opacity = calcValues(values.descMessageB_opacity_in, currentYoffset)
                    objs.descMessageB.style.transform = `translateY(${calcValues(values.descMessageB_translateY_in, currentYoffset)}%)`
                }else{
                    objs.descMessageB.style.opacity = calcValues(values.descMessageB_opacity_out, currentYoffset)
                    objs.descMessageB.style.transform = `translateY(${calcValues(values.descMessageB_translateY_out, currentYoffset)}%)`
                }

                if(scrollRatio <= 0.88){
                    objs.descMessageC.style.opacity = calcValues(values.descMessageC_opacity_in, currentYoffset)
                    objs.descMessageC.style.transform = `translateY(${calcValues(values.descMessageC_translateY_in, currentYoffset)}%)`
                }else{
                    objs.descMessageC.style.opacity = calcValues(values.descMessageC_opacity_out, currentYoffset)
                    objs.descMessageC.style.transform = `translateY(${calcValues(values.descMessageC_translateY_out, currentYoffset)}%)`
                }

                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYoffset))
                // objs.context.drawImage(objs.videoImages[sequence2],0,0)

                if(scrollRatio <= 0.5){
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYoffset)
                }else{
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYoffset)
                }

                //currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작

                if(scrollRatio > 0.9){

                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                    const widthRatio = window.innerWidth /objs.canvas.width
                    const heightRatio =window.innerHeight / objs.canvas.height
                    let canvasScaleRatio
    
                    if(widthRatio <= heightRatio){
                        //캔버스 보다 브라우저 창이 홀쭉한경우
                        canvasScaleRatio = heightRatio
                    }else{
                        //캔버스 보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio
                    }
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`
                    objs.context.fillStyle = 'white'
                    objs.context.drawImage(objs.images[0], 0, 0)
    
                    //캔버스 사이즈에 맞춰 가정한 innerwidth와 innerheight = 새로운 창크기
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio; 
    
                    const whiteRectWidth = recalculatedInnerWidth * 0.15 
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2 
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth 
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth 
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth 
    
                    objs.context.fillRect(parseInt((values.rect1X[0])),0,parseInt(whiteRectWidth),objs.canvas.height)
                    objs.context.fillRect(parseInt((values.rect2X[0])),0,parseInt(whiteRectWidth),objs.canvas.height)
                }
                break;

            case 3:
                let step = 0;
                //가로세로 모두 꽉차게 하기위해 여기서 세팅(계산필요)
                const widthRatio = window.innerWidth /objs.canvas.width
                const heightRatio =window.innerHeight / objs.canvas.height
                console.log(widthRatio, window.innerWidth, objs.canvas.width)
                console.log(heightRatio, window.innerHeight, objs.canvas.height)
                let canvasScaleRatio

                if(widthRatio <= heightRatio){
                    //캔버스 보다 브라우저 창이 홀쭉한경우
                    canvasScaleRatio = heightRatio
                }else{
                    //캔버스 보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`
                objs.context.fillStyle = 'white'
                objs.context.drawImage(objs.images[0], 0, 0)

                //캔버스 사이즈에 맞춰 가정한 innerwidth와 innerheight = 새로운 창크기
               
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; //크롬 스크롤값제외하기위해 body.offsetWidth, objs.canvas.width 1270
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio; //objs.canvas.height 1080
                console.log(recalculatedInnerWidth)
                // console.log(recalculatedInnerWidth)
                //하얀박스 폭
                 //캔버스 본래 크기위에다가 흰창을 그려야 캔버스 scale 0.772했을때 같이 맞게 줄어듬.
                const whiteRectWidth = recalculatedInnerWidth * 0.15
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2 
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth 
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth 
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth 

                console.log(values.rect1X[0])

                if(!values.rectStartY){ //값이 없다면 실행
                    //캔버스 위치 offsetTop을 계산할때 scale의 크기가 줄어든 만큼의 top 위치를 나타내는것이아니라 원래 캔버스의 크기를 계산해준다. 그래서 따로 scale크기만큼의 탑값을구해줘야함
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) /2; //748
                    values.rect1X[2].start = (window.innerHeight / 2  )/ scrollHeight //0.1 3번 section시작된 상태에서 윈도우 반틈값에 스크롤 오면 시작
                    values.rect1X[2].end = values.rectStartY / scrollHeight //0.17 캔버스의 상단이 닿으면 하얀창 애니메이션 끝.
                    values.rect2X[2].start = (window.innerHeight / 2  )/ scrollHeight
                    values.rect2X[2].end = values.rectStartY / scrollHeight
              
                }
                //좌우흰색박스구하기 x,y,width,height
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth),objs.canvas.height)
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth),objs.canvas.height)
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYoffset)),0,parseInt(whiteRectWidth),objs.canvas.height)
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYoffset)),0,parseInt(whiteRectWidth),objs.canvas.height)
                console.log(calcValues(values.rect1X, currentYoffset))


                if(scrollRatio < values.rect1X[2].end){
                    //흰색 네모가 다 없어지기전까지.. 덜 스크롤이 되었다면? scrollRatio = currentYscroll/scrollHeight
                    step = 1
                    objs.canvas.classList.remove('sticky')
                   

                }else{
                    //블렌드처리
                    step = 2
                    objs.canvas.classList.add('sticky') //블렌드처리될때 캔버스는 sticky-elem position fixed가 된다.
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) /2}px`

                    //blendHeight = [0,0,{start:0,end:0}]
                    
                   
                    values.blendHeight[0] = 0; //애니메이션 초기값 (블렌드시킬높이 초기값)
                    values.blendHeight[1] = objs.canvas.height //애니메이션 끝남 (블렌드시킬높이 마지막값)
                    values.blendHeight[2].start = values.rect1X[2].end //애니메이션이 시작되는 시점 (=스크롤시점)
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2 //애니메이션 끝나는 시점 (스크롤스피드조절) 3번째신 전체 스크롤 height에 20%구간만큼 블랜드 하이트 재생되도록 하겠다
                    const blendHeight = calcValues(values.blendHeight, currentYoffset)


                    //img,sx,sy,swidth,sheight, dx, dy, dwidth,dheight
                    objs.context.drawImage(objs.images[1],0,objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0,objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                        )

                    if(scrollRatio > values.blendHeight[2].end){
                        values.canvas_scale[0] = canvasScaleRatio
                        values.canvas_scale[1] = document.body.offsetWidth/(1.5 * objs.canvas.width)
                        values.canvas_scale[2].start = values.blendHeight[2].end
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; //20%구간만큼 축소처리
                        
                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYoffset)})`
                        objs.canvas.style.marginTop = 0
                    }

                    if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0){
                       objs.canvas.classList.remove('sticky')
                       objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`

                       values.canvasCaption_opacity[2].start = values.canvas_scale[2].end
                       values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1; //시작시점에서 일정비율 더해주기. 이씬의 전체 스크롤 10%만큼 스크롤될동안 쓱 올라오게끔.
                       values.canvasCaption_translateY[2].start = values.canvas_scale[2].end
                       values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start + 0.1;
                       
                       objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity,currentYoffset)
                       objs.canvasCaption.style.transform = `translateY(${calcValues(values.canvasCaption_translateY,currentYoffset)}%)`
                    
                    }
                }
                break;
        }
    }


    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0

        //스크롤 섹션 판별
         for (let i=0; i<currentScene; i++){
            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
         }

         if(delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            document.body.classList.remove('scroll-effect-end')
         }

         if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            if(currentScene === sceneInfo.length - 1){
                document.body.classList.add('scroll-effect-end')
            }

            if(currentScene < sceneInfo.length - 1){ //currentScene이 3보다 작을때 늘려줌
            currentScene++
        }
            document.body.setAttribute('id', `show-scene-${currentScene}`)
         }

         if(delayedYOffset < prevScrollHeight){
            enterNewScene = true;

            if(currentScene === 0){
                return // 브라우저 마이너스값 버그를 막기위함
            }
            currentScene--
            document.body.setAttribute('id', `show-scene-${currentScene}`)
         }

            if(enterNewScene) { //true면 순간적으로 scrollLoop함수 종료
                return
            }
         playAnimation()
    }


    function setLayout (){
        // 각 스크롤 섹션의 높이 세팅
        for(let i=0; i<sceneInfo.length; i++){

            if(sceneInfo[i].type === 'sticky' ){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; //맥기준 윈도우창 834 = 윈도우 창기준으로 5배 길이로 스크롤 구간 높이 지정.
               
            }else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight //padding, border 값을 포함한 컨텐츠의 높이를 가져온다. (margin은 포함하지 않는다.)
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
           
        }

        yOffset = window.pageYOffset; //새로고침할때 그 순간의 페이지 scene기억
        let totalScrollHeight = 0;
        for(let i = 0; i<sceneInfo.length; i++){
            totalScrollHeight = totalScrollHeight + sceneInfo[i].scrollHeight

            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`)

        const heightRatio = window.innerHeight/1080
        sceneInfo[0].objs.canvas.style.transform = `translate(-50%, -50%) scale(${heightRatio})`
        sceneInfo[2].objs.canvas.style.transform = `translate(-50%, -50%) scale(${heightRatio})`
    }


//requestAnimationFrame을 통한 부드럽게 고화질 비디오 처리
    function loop(){
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc


        if(!enterNewScene){ //enterNewScene이 아닐때만 실행한다. (false일떄 실행되어야함)
         if(currentScene === 0 || currentScene === 2){
            const currentYoffset = delayedYOffset - prevScrollHeight;
            const values = sceneInfo[currentScene].values;
            const objs = sceneInfo[currentScene].objs;
        let sequence = Math.round(calcValues(values.imageSequence, currentYoffset))
          if(objs.videoImages[sequence]){ //해당되는 시퀀스의 이미지가 존재할때만 실행해라.
        objs.context.drawImage(objs.videoImages[sequence],0,0)}}
}

        rafId = requestAnimationFrame(loop)
   

        if(Math.abs(yOffset - delayedYOffset)< 1){
            cancelAnimationFrame(rafId)
            rafState = false
        }
    }

    window.addEventListener('load', ()=>{

        document.body.classList.remove('before-load')
        setLayout()
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0],0,0)

        //새로고침했을때
        let tempYOffset = yOffset;
        let tempScrollCount = 0;

        if(tempYOffset > 0){
            let siId = setInterval(()=>{
        window.scrollTo(0,tempYOffset)
          tempYOffset= tempYOffset+5 //5px씩
          
         if(tempScrollCount > 20){
            clearInterval(siId)}

            tempScrollCount++
        },20)
       }

        window.addEventListener('scroll', ()=>{
            yOffset = window.pageYOffset;
            scrollLoop()
            checkMenu()
            if(!rafState){
                rafId = requestAnimationFrame(loop);
                rafState = true
            }
        })

        window.addEventListener('resize', ()=>{
            if(window.innerWidth > 900){
                window.location.reload()
                // setLayout()
                // sceneInfo[3].values.rectStartY = 0 //초기값
            }
        })

        window.addEventListener('orientationchange', ()=>{
            scrollTo(0,0)
            setTimeout(()=>{window.location.reload()},500) //돌리고 0.5초뒤에 셋레이아웃시작
        }) //모바일기기 방향을 바꿀때 일어나는 이벤트. 폰 방향을 바꿀때 셋레이아웃 실행되도록

        document.querySelector('.loading').addEventListener('transitionend',  (e)=>{
            document.body.removeChild(e.currentTarget) //transitionend이 되고 난 후에 발생하는 이벤트 
        })
    
       
    })


    setCanvasImages() 

})()
