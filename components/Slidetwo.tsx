import * as React from "react";
import style from "./Carousel.module.css"
import image from "next/image"
import cupcake1 from "../assets/Cupcakes1.jpg"

const SlideTwo = () => (
  <div className={style.carouselcontainer}>
    <div className={style.textwrapper}>
      <h1>
        Header 1
      </h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia tenetur fuga rem ab voluptates illo qui error unde, veniam esse, nisi voluptatem itaque expedita aut quasi debitis sapiente accusamus deserunt?
      </p>
    </div>
    <img src={cupcake1.src} alt="cupcakes" />
  </div>
);

export default SlideTwo;