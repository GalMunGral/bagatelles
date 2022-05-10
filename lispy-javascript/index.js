import { _, q, EVAL, PRINT, SET, DEFUN, LAMBDA, ASSIGN, CALL, PROGN, COND, LET, ASYNC, add, sub, mul, div, exp, eq, gt, lt, gte, lte } from '/core.js';
  
const test = Symbol('test');
const log = Symbol('log');
const calc = Symbol('calc');

function timer(n) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, n);
    })
}

PROGN(
  _(SET, log, console.log),

  _(SET, test, _(q, 1, 2, 3)),
  _(log, _(PRINT, test)),

  _(DEFUN, calc, (a, b) => _(exp, 2, _(mul, a, b))),
  _(log, _(calc, 2, 3)),

  _(ASYNC,
    () => _(timer, 2000),
    () => _(fetch, 'https://yesno.wtf/api/'),
    (res) => _(CALL, res, 'json'),
    (json) => _(PROGN,
        _(log, json.image),
        _(LET, {
            image: _(CALL, document, 'querySelector', '#image')
        }, ({ image }) => _(
            _(ASSIGN, image, 'src', json.image)
        )))
  )
)

EVAL(
  _(window.addEventListener, 'load', _(LAMBDA, () => (
    _(setTimeout, _(LAMBDA, () => (
      _(COND,
        _(_(gt, _(Math.random), 0.5), _(PROGN,
          _(log, 'Yay! Greater than 0.5!'),
          _(log, 'Test progn')
        )),
        _(_(true), _(LET, {a: 100, b: 200}, ({a, b}) => _(PROGN,
          _(log, 'Aww... Less than 0.5.'),
          _(log, 'a:', a),
          _(log, 'b:', b)
        )))
      )  
    ), 100)))))
)
