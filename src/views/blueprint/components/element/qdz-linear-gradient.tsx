import { QdzLink } from "/@/store/blueprint";

type Props = {
  link: QdzLink;
  startColor: string;
  endColor: string;
};

export default (props: Props) => {
  const [x1, y1, x2, y2] = props.link.points;
  // 缩放
  let w = Math.abs(x2 - x1),
    h = Math.abs(y2 - y1);
  let woh100 = Math.max(w, h);
  let x0 = 0,
    y0 = 0,
    xt = (x2 - x1) / woh100 || 0,
    yt = (y2 - y1) / woh100 || 0;
  // 平移
  if (y2 < y1) {
    y0 += 1;
    yt += 1;
  }
  if (x2 < x1) {
    x0 += 1;
    xt += 1;
  }
  const archs = [x0, y0, xt, yt].map((n) => `${100 * n}%`);
  return (
    <linearGradient
      key={props.link.id}
      id={`linearGradient-${props.link.id}`}
      x1={archs[0]}
      y1={archs[1]}
      x2={archs[2]}
      y2={archs[3]}
    >
      <stop
        offset="25%"
        style={`stop-color: ${props.startColor}; stop-opacity: 1`}
      />
      <stop
        offset="70%"
        style={`stop-color:  ${props.endColor}; stop-opacity: 1`}
      />
    </linearGradient>
  );
};
