'use client'

import { useState, useEffect } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps {
  images: string[]
  autoPlayInterval?: number
}

export default function Carousel({ images, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [images.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselInner}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.carouselSlide} ${
              index === currentIndex ? styles.active : ''
            }`}
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className={`${styles.carouselButton} ${styles.prev}`}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={goToNext}
        className={`${styles.carouselButton} ${styles.next}`}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className={styles.carouselDots}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.dot} ${
              index === currentIndex ? styles.activeDot : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
