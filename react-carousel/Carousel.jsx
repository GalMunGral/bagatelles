import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  --carousel-height: ${(props) => props.height};
  --carousel-width: ${(props) => props.width};
  height: var(--carousel-height);
  width: var(--carousel-width);
  margin: 50px auto;
  position: relative;
  transform-style: preserve-3d;
  perspective: 150px;
  perspective-origin: center center;
`;

const Slide = styled.div`
  width: calc(1 / 3 * var(--carousel-width));
  height: var(--carousel-height);
  position: absolute;
  transform: translate3d(
    calc(
      ${({ offset }) =>
          offset === 0
            ? 1 / 3
            : offset === -1 || offset === -2
            ? 0
            : offset === 1 || offset === 2
            ? 2 / 3
            : 1 / 3} * var(--carousel-width)
    ),
    0,
    ${({ offset }) =>
      offset === 0
        ? 10
        : Math.abs(offset) === 1
        ? 0
        : Math.abs(offset) === 2
        ? -10
        : -20}px
  );
  filter: brightness(${({ offset }) => (offset === 0 ? 1 : 0.5)});
  transition: all 0.5s ease-in-out ${({ offset }) => (offset === 0 ? 0.1 : 0)}s;
`;

const SlideImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

function Carousel({ items, height, width, interval }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  let timer;
  useEffect(() => {
    timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  });

  return (
    <Container
      height={height}
      width={width}
      onMouseEnter={() => {
        clearTimeout(timer);
      }}
      onMouseMove={() => {
        // Freeze on 'mousemove' instead of 'mouseenter' after clicking
        // 'mouseenter' won't fire because mouse is already inside the element
        clearTimeout(timer);
      }}
      onMouseLeave={() => {
        timer = setTimeout(next, interval / 2);
      }}
    >
      {items.map((item, i) => {
        const rightOffset = (i - currentIndex + items.length) % items.length;
        const leftOffset = (i - currentIndex - items.length) % items.length;
        const offset =
          Math.abs(leftOffset) < Math.abs(rightOffset)
            ? leftOffset
            : rightOffset;
        return (
          <Slide
            key={i}
            offset={offset}
            onClick={() => {
              clearTimeout(timer);
              setCurrentIndex(i);
            }}
          >
            <SlideImage src={item.imageUrl} alt={item.fallback} />
          </Slide>
        );
      })}
    </Container>
  );
}

export default Carousel;
