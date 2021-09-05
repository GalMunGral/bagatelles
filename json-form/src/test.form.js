const data = {
  amount: 100,
  companyTitle: "test-test-test",
  name: "Steve Jobs",
  revenue: 1000000,
};

export default {
  initialData: data,
  fields: {
    name: {
      type: "input",
      props: {
        type: "text",
        placeholder: "this is a simple element",
      },
    },
    companyTitle: {
      type: "text",
      props: {
        label: "Company & Title",
        placeholder: "Please enter your company and title",
      },
      validate: {
        required: true,
        minlength: 12,
        pattern: /^[A-Z]/,
        首尾相同: (v) => {
          return v[0] === v[v.length - 1];
        },
      },
    },
    revenue: {
      type: "currency",
      props: {
        label: "钱钱",
        placeholder: "money",
      },
      convert: parseInt,
      validate: {
        max: 10000,
      },
    },
    amount: {
      type: "number",
      props: {
        label: "Amount",
        placeholder: "please enter a number",
      },
      convert: Number,
      validate: {
        min: 10,
        max: 20,
      },
    },
    test: {
      type: "button",
      formType: "submit",
      props: {
        type: "button",
        variant: "warning",
        children: "Submit",
      },
    },
  },
  validate(inputData) {
    return inputData.name === "Steve";
    // return inputData.companyTitle?.length === inputData.amount;
  },
  onSubmit: (v) => {
    alert(JSON.stringify(v));
  },
};
