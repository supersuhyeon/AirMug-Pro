## Apple clone - AirMug Pro

![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/94214512/190957369-a4883189-68d5-4d84-b5d5-65d9f208850b.gif)
[Apple-Clone-AirMug-Pro-website](https://snazzy-malabi-fbabfd.netlify.app/)

### Goals of the project

1. Learn about the high resolution of video interaction with requestAnimationFrame method
2. Code scroll interaction from scratch without Javascript scroll libraries
3. Compatibility browser resizing and devices' screen width and height

### Languages

HTML, CSS, Javascript

### Features

1.  Calculate animation values on special scroll section
    ![scroll01](https://user-images.githubusercontent.com/94214512/187851225-396a1e0a-4aeb-4cd1-9d2f-637c48eab2ca.png)

    ```js
    function calcValues(values, currentYoffset) {
      let rv; //animation's result value
      const scrollHeight = sceneInfo[currentScene].scrollHeight;
      const scrollRatio = currentYoffset / scrollHeight; //Get the percentage of the scrolled range in the current scrolling section

      if (values.length === 3) {
        //when there is a particular section for animation

        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd = values[2].end * scrollHeight;
        const partScrollHeight = partScrollEnd - partScrollStart;

        if (
          currentYoffset >= partScrollStart &&
          currentYoffset <= partScrollEnd
        ) {
          rv =
            ((currentYoffset - partScrollStart) / partScrollHeight) *
              (values[1] - values[0]) +
            values[0];

          //when the cursor is between partScrollStart and partScrollEnd, this value will be the animation value
          //the reason for multiplying partscrollheight by the value[1],[0] is to set the section where the animation is to be executed
        } else if (currentYoffset < partScrollStart) {
          rv = values[0]; //when cursor is not reached at partScrollStart, animation will be value[0] which is the initial value of animation
        } else if (currentYoffset > partScrollEnd) {
          rv = values[1]; //animation will be value[1]
        }
      } else {
        //when there is no particular section for animation
        rv = scrollRatio * (values[1] - values[0]) + values[0];
      }

      return rv;
    }
    ```

2.  Image-blending animation on currentScene3
    ![blendingimage2](https://user-images.githubusercontent.com/94214512/190970356-87db2be3-fa41-4fda-af18-320d9b8dc6cc.png)

```js
//to fully fill up both width and height on all different devices
const widthRatio = window.innerWidth / objs.canvas.width;
const heightRatio = window.innerHeight / objs.canvas.height;
let canvasScaleRatio;

if (widthRatio <= heightRatio) {
  //If the browser window is thinner than the canvas
  //like a mobile phone that height is longer than width
  canvasScaleRatio = heightRatio;
} else {
  //If the browser window is flatter than the canvas
  //like a particular device where the width is larger than its height
  canvasScaleRatio = widthRatio;
}
objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
objs.context.fillStyle = "white";
objs.context.drawImage(objs.images[0], 0, 0);

//1. Draw white boxes on the canvas.
//2. Canvas is already resized by scale.
//3. Must remember that you are drawing white boxes on the original canvas size, not the resized canvas by canvasScaleRatio.
//4. To draw on the original canvas size, need to obtain a recalculatedInnerWidth value and recalculatedInnerheight value like below;
//5. The result which includes white boxes on the canvas will be displayed according to the scale which is canvasScaleRatio.

//Used document.body.offsetWidth due to Chrome's scroll bar width instead of window.innerwidth
const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
```

3.  Deceleration equation for smooth video, using requestAnimationFrame
    ![deceleration](https://user-images.githubusercontent.com/94214512/189497713-0ef2ad6c-6e8e-4611-beeb-81f4ec442be5.png)

```js
function loop() {
  delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
  // by using delayedYOffset value instead of window.pageYoffset, could make it scroll smoothly

  if (!enterNewScene) {
    if (currentScene === 0 || currentScene === 2) {
      //video scroll animation sections
      const currentYoffset = delayedYOffset - prevScrollHeight;
      const values = sceneInfo[currentScene].values;
      const objs = sceneInfo[currentScene].objs;
      let sequence = Math.round(
        calcValues(values.imageSequence, currentYoffset)
      );
      if (objs.videoImages[sequence]) {
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }
  }

  rafId = requestAnimationFrame(loop);

  if (Math.abs(yOffset - delayedYOffset) < 1) {
    cancelAnimationFrame(rafId);
    rafState = false;
  }
}
```

### reference link

[apple-website-clone-coding-by-illbuncoding](https://www.inflearn.com/course/%EC%95%A0%ED%94%8C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98-%ED%81%B4%EB%A1%A0/dashboard) <br>
[apple-offical-website-Airpods-text](https://www.apple.com/airpods-2nd-generation/)

### Self-reflection

I always had a dream to make an interactive website like Apple's.
I have no idea how many times I referenced Apple's developer tools, MDN, and videosto understand. I had to handwrite some of the concepts and functions more than 5-6 times to understand.<br>
It was much more difficult and complex than I had expected, which led me to draw with pen and paper to better understand the project. As a result of completing this project, I now try to be more accurate when calculating elements and device compatibility. This clone project has made me more interested in web development and I'm glad that I persevered to finish this project despite moments where I struggled. <br> I always want to be a better coder than yesterday!!
