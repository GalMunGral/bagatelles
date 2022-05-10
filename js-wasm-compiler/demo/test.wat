(module
  (import "js" "log" (func $log (param i32) (param i32)))
  (import "js" "mem" (memory 1))
  (data (i32.const 0) "ERROR")
  (func $determinant (param $a f64) (param $b f64) (param $c f64) (result f64)
    (local $__return__ f64) 
    (local.get $b)
    (local.get $b)
    (f64.mul)
    (f64.const 4)
    (local.get $a)
    (f64.mul)
    (local.get $c)
    (f64.mul)
    (f64.sub)
    (local.set $__return__)
    (local.get $__return__)
  )
  (func $solve (param $a f64) (param $b f64) (param $c f64) (result f64)
    (local $__return__ f64) (local $det f64)
    (local.get $a)
    (local.get $b)
    (local.get $c)
    (call $determinant)
    (local.set $det)
    (local.get $det)
    (f64.const 0)
    (f64.le)
    (if
      (then
        (i32.const 0)
        (i32.const 5)
        (call $log)
        (f64.const 0)
        (local.set $__return__))
      (else
        (local.get $b)
        (f64.neg)
        (local.get $det)
        (f64.sqrt)
        (f64.add)
        (f64.const 2)
        (local.get $a)
        (f64.mul)
        (f64.div)
        (local.set $__return__)))
    (local.get $__return__)
  )
  (func $factorial (param $n f64) (result f64)
    (local $__return__ f64) (local $m f64)
    (local.get $n)
    (f64.const 2)
    (f64.lt)
    (if
      (then
        (f64.const 1)
        (local.set $__return__))
      (else
        (local.get $n)
        (f64.const 1)
        (f64.sub)
        (local.set $m)
        (local.get $n)
        (local.get $m)
        (call $factorial)
        (f64.mul)
        (local.set $__return__)))
    (local.get $__return__)
  )
  (func $fibonacci (param $n f64) (result f64)
    (local $__return__ f64) (local $l f64) (local $m f64)
    (local.get $n)
    (f64.const 2)
    (f64.lt)
    (if
      (then
        (local.get $n)
        (local.set $__return__))
      (else
        (local.get $n)
        (f64.const 2)
        (f64.sub)
        (local.set $l)
        (local.get $n)
        (f64.const 1)
        (f64.sub)
        (local.set $m)
        (local.get $l)
        (call $fibonacci)
        (local.get $m)
        (call $fibonacci)
        (f64.add)
        (local.set $__return__)))
    (local.get $__return__)
  )
  (export "determinant" (func $determinant))
  (export "solveQuadratic" (func $solve))
  (export "factorial" (func $factorial))
  (export "fibonacci" (func $fibonacci))
)