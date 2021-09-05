let sc;
let data;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const textDiv = document.querySelector(".text");

function domain(url) {
  let i;
  try {
    i = url.match(/(?<!\/)\/(?!\/)/).index;
  } catch (err) {
    console.log(err, url);
  }
  return url.slice(0, i);
}

d3.json("http://localhost:8080/data.json")
  .then((data) => {
    return data
      .map((d) => ({
        start: new Date(d.start).getTime(),
        duration: new Date(d.end).getTime() - new Date(d.start).getTime(),
        domain: domain(d.url),
        title: d.title,
      }))
      .filter((d) => d.duration)
      .sort((a, b) => a.start - b.start);
  })
  .then((data) => {
    return d3
      .nest()
      .key((d) => d.domain)
      .rollup((arr) =>
        arr.map((entry) => {
          return {
            start: entry.start,
            end: entry.start + entry.duration,
          };
        })
      )
      .entries(data);
  })
  .then((data) => {
    const MIN_TIME = d3.min(
      data.map((g) => g.value).reduce((acc, cur) => acc.concat(cur)),
      (interval) => interval.start
    );
    const MAX_TIME = d3.max(
      data.map((g) => g.value).reduce((acc, cur) => acc.concat(cur)),
      (interval) => interval.end
    );

    function getX(timestamp) {
      const fromStart = timestamp - MIN_TIME;
      const ratio = fromStart / (MAX_TIME - MIN_TIME);
      return ratio * 20000;
    }

    data.forEach((d, i) => {
      const curY = 20 * i;
      d.value.forEach((interval) => {
        context.fillRect(
          getX(interval.start),
          curY,
          getX(interval.end) - getX(interval.start),
          20
        );
      });
    });

    window.onmousemove = function (e) {
      let rect = canvas.getBoundingClientRect();
      if (e.clientY < rect.y) return;
      let index = Math.floor((e.clientY - rect.y) / 10);
      textDiv.innerHTML = "URL: " + data[index].key;
    };

    window.onscroll = function (e) {
      textDiv.style.left = window.scrollX + 10;
      textDiv.style.top = window.scrollY;
    };
  });
