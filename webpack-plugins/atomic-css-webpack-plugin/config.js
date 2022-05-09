module.exports = {
  'flex__([a-z0-9-]+?)__([a-z0-9-]+?)__([a-z0-9-]+?)': (g) => `
    display: flex;
    flex-direction: ${g[1]};
    align-items: ${g[2]};
    justify-content: ${g[3]};
  `,
  '(margin|padding)__([a-z0-9-]+?)': (g) => `
    ${g[1]}: ${g[2]}rpx;
  `,
  '(margin|padding)-(x|y)__([a-z0-9-]+?)': (g) => `
    ${g[1]}-${g[2] === 'x' ? 'left' : 'top'}: ${g[3]}rpx;
    ${g[1]}-${g[2] === 'x' ? 'right' : 'bottom'}: ${g[3]}rpx;
  `,
  '(margin|padding)-(left|right|top|bottom)__([a-z0-9-]+?)': (g) => `
    ${g[1]}-${g[2]}: ${g[3]}rpx;
  `,
  'flex-item__([a-z-]+?)': (g) => `
    flex: ${g[1]};
  `,
  'flex-item__([a-z-]+?)__([a-z-]+?)': (g) => `
    flex: ${g[1]};
    align-self: ${g[2]};
  `,
  'text-align__([a-z0-9-]+?)': (g) => `
    text-align: ${g[1]};
  `,
  'font__([a-z0-9-]+?)': (g) => `
    font-size: ${g[1]}rpx;
    font-weight: 400;
  `,
  'font__([a-z0-9-]+?)__([a-z0-9-]+?)': (g) => `
    font-size: ${g[1]}rpx;
    font-weight: ${g[2]};
  `,
  'height__([a-z0-9-]+?)': (g) => `
    height: ${g[1]}rpx;
  `,
  'line-height__([a-z0-9-]+?)': (g) => `
    line-height: ${g[1]}rpx;
  `,
  'width__([a-z0-9-]+?)': (g) => `
    width: ${g[1]}rpx;
  `,
  '(max|min)-width__([a-z0-9-]+?)': (g) => `
    ${g[1]}-width: ${g[2]}rpx;
  `,
  'border-radius__([a-z0-9-]+?)': (g) => `
    border-radius: ${g[1]}rpx;
  `,
  'border__([a-z0-9-]+?)': (g) => `
    border-color: #f5f5f5;
    border-style: solid;
    border-width: ${g[1]}rpx;
  `,
  'border-([a-z0-9-]+?)__([a-z0-9-]+?)': (g) => `
    border-color: #f5f5f5;
    border-style: solid;
    border-width: 0;
    border-${g[1]}-width: ${g[2]}rpx;
  `,
  round: `
    border-radius: 50%;
  `,
  'text-([a-z0-9-]+?)': (g) => {
    const color = {
      main: '#2b3c4d',
      secondary: '#808a94',
      danger: '#d9534f',
      white: 'white',
    }[g[1]];

    return `
      color: ${color};
    `;
  },
  'background-([a-z0-9-]+?)': (g) => {
    const color = {
      main: '#315eff',
      secondary: '#d5d8db',
      white: 'white',
    }[g[1]];

    return `
      background: ${color};
    `;
  },
  truncated: `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
};
