import React, { useMemo, useCallback, useState } from "react";

const assert = (test, message) => {
  try {
    if (!test()) throw message;
  } catch {
    throw message;
  }
};

const compileConstraints = (constraints = {}) => {
  return Object.entries(constraints).map(([type, test]) => {
    switch (type) {
      case "required":
        return (v) => {
          assert(() => !test || !!v, "valueMissing");
        };
      case "pattern":
        return (v) => {
          assert(() => new RegExp(test).test(v), "patternMismatch");
        };
      case "min":
        return (v) => {
          assert(() => Number(v) >= test, "rangeUnderflow");
        };
      case "max":
        return (v) => {
          assert(() => Number(v) <= test, "rangeOverflow");
        };
      case "step":
        return (v) => {
          assert(
            () => (Number(v) - Number(meta.validate.min)) % test === 0,
            "stepMismatch"
          );
        };
      case "minlength":
        return (v) => {
          assert(() => String(v).length >= test, "tooShort");
        };
      case "maxlength":
        return (v) => {
          assert(() => String(v).length <= maxlength, "tooLong");
        };
      default:
        return (v) => {
          assert(() => test(v), type);
        };
    }
  });
};

const Form = ({
  validate = () => {},
  fields = {},
  initialData = {},
  onSubmit = () => {},
}) => {
  return function JsonForm() {
    const metas = useMemo(() => {
      const metas = {};
      Object.entries(fields)
        .filter(([, meta]) => meta.formType !== "submit")
        .map(([field, meta]) => {
          const convert =
            typeof meta.convert === "function" ? meta.convert : (x) => x;
          const constraints = compileConstraints(meta.validate);
          const validate = (v) => {
            const validity = {
              valid: true,
            };
            constraints.forEach((test) => {
              try {
                test(v);
              } catch (violation) {
                validity.valid = false;
                validity[violation] = true;
              }
            });
            return validity;
          };
          metas[field] = {
            convert,
            validate,
          };
        });
      return metas;
    }, []);

    const [state, setState] = useState(() => {
      const initialState = {};
      Object.keys(metas).forEach((field) => {
        const initialValue = initialData[field];
        const { validate } = metas[field];
        initialState[field] = {
          value: initialValue,
          validity: validate(initialValue),
        };
      });
      return initialState;
    });

    const inputData = useMemo(() => {
      const data = {};
      Object.keys(state).forEach((field) => {
        data[field] = state[field].value;
      });
      return data;
    }, [state]);

    const formValidated = useMemo(() => {
      return (
        validate(inputData) &&
        Object.values(state).every((fieldState) => fieldState.validity.valid)
      );
    }, [state]);

    const handleSubmit = useCallback(() => {
      console.log(inputData);
      if (formValidated) {
        onSubmit(inputData);
      } else {
        alert("form not validated");
      }
    }, [state]);

    const renderField = useCallback(
      ([field, meta]) => {
        const Component = meta.type;
        let props = meta.props ?? {};
        if (meta.formType === "submit") {
          return (
            <Component
              {...props}
              key="submit"
              onClick={(e) => {
                if (typeof props.onClick === "function") {
                  if (!props.onClick(e)) return;
                }
                handleSubmit();
              }}
            />
          );
        } else {
          return (
            <Component
              {...props}
              key={field}
              value={state[field].value ?? ""}
              validity={state[field].validity}
              onChange={(e) => {
                const { convert, validate } = metas[field];
                const value = convert(e.target.value);
                setState({
                  ...state,
                  [field]: {
                    value: value,
                    validity: validate(value),
                  },
                });
              }}
            />
          );
        }
      },
      [state]
    );

    return (
      <form onSubmit={handleSubmit}>
        {Object.entries(fields).map(renderField)}
      </form>
    );
  };
};

export default Form;
