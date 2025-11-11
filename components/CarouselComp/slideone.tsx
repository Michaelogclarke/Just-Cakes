import * as React from "react";
import style from "../Carousel.module.css"


const SlideOne = () => (
  <div className={style.carouselcontainer}>
    <div className={style.textwrapper}>
      <h1>
        Header 1
      </h1>
      <p>
      </p>
    </div>
    <img src="assets/Cupcakes1.png" />
  </div>
);

export default SlideOne;