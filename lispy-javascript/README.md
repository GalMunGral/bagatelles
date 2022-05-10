# LISP-y JavaScript
Inspired by [Recursive Functions of Symbolic Expressions and Their Computation by Machine](https://aiplaybook.a16z.com/reference-material/mccarthy-1960.pdf)

### Sample Code 1 - Macro
```js
EVAL(
  _(window.addEventListener, 'load', _(LAMBDA, () => (
    _(setTimeout, _(LAMBDA, () => (
      _(COND, // `COND` is a macro that defines the following custom syntax for conditional statements
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
```
### Sample Code 2 - Asynchronous pipe:
```js
EVAL(
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
```
