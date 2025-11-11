import * as React from "react";
import style from "./Carousel.module.css"
import cupcake2 from "../assets/cupcakes2.jpg"
const SlideOne = () => (
  <div className={style.carouselcontainer}>
    <div className={style.textwrapper}>
      <h1>
        Header 1
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum saepe deleniti repellat sit blanditiis facilis velit ex modi at, provident cum ullam qui sint. Sed aperiam culpa porro ipsam dolorem.
      </p>
    </div>
    <img src={cupcake2.src}/>
  </div>
);

export default SlideOne;