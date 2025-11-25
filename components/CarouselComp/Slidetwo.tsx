import * as React from "react";
import style from "../Carousel.module.css"

const SlideTwo = () => (
  <div className={style.carouselcontainer}>
    <div className={style.textwrapper}>
      <h1>
        Header 1
      </h1>
      <p>
        A short paragraph with some descriptive text.
      </p>
    </div>
    <img src="https://via.placeholder.com/400/3D1D73/ffffff" />
  </div>
);

export default SlideTwo;