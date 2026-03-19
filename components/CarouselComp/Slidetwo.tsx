import * as React from "react";
import Image from "next/image";
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
    <Image src="https://via.placeholder.com/400/3D1D73/ffffff" alt="Placeholder" width={400} height={400} />
  </div>
);

export default SlideTwo;