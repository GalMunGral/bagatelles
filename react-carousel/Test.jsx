import React from "react";
import Carousel from "./Carousel";

function Test() {
  const items = [
    {
      imageUrl:
        "http://p1.music.126.net/LtwLZ5mxNv4XZW3pfDiByg==/109951165379971801.jpg?imageView&quality=89",
      fallback: "haha",
    },
    {
      imageUrl:
        "http://p1.music.126.net/xi4rUVsFvzchfAdp81uWzg==/109951165380949857.jpg?imageView&quality=89",
      fallback: "haha",
    },
    {
      imageUrl:
        "http://p1.music.126.net/dyRfayU2aoyTICSY-N1YSw==/109951165380069844.jpg?imageView&quality=89",
      fallback: "haha",
    },
    {
      imageUrl:
        "http://p1.music.126.net/mvBfJUvTb-yOdwvtW_XK7w==/109951165380033580.jpg?imageView&quality=89",
      fallback: "haha",
    },
    {
      imageUrl:
        "http://p1.music.126.net/s-kSbg0wiTnJ6u-31WgErQ==/109951165380081683.jpg?imageView&quality=89",
      fallback: "haha",
    },
    {
      imageUrl:
        "http://p1.music.126.net/A5arMwHdqlo-d7X0glodPw==/109951165379987258.jpg?imageView&quality=89",
      fallback: "haha",
    },
  ];
  return <Carousel items={items} interval="1500" height="200px" width="90vw" />;
}

export default Test;
