"use client";

import * as React from "react";
import style from "./Carousel.module.css"


interface IProps {
  children: JSX.Element[];
}

const Carousel = ({ children }: IProps) => {
  const activeSlide = children.map(slide => (
    <>
      {slide}
    </>
  ));

  return (
    <div>
        {activeSlide}
    </div>
  );
};

export default Carousel;