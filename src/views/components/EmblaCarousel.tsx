import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ComponentType } from 'react'

type EmblaSlide = Record<string, unknown>
type EmblaProps<T extends EmblaSlide> = {
  slides: T[]
  Slide: ComponentType<T>
  options?: EmblaOptionsType
}

export const EmblaCarousel = <T extends EmblaSlide>({ slides, Slide, options }: EmblaProps<T>): JSX.Element => {
  const [emblaRef] = useEmblaCarousel(options)
  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <Slide {...slide} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
