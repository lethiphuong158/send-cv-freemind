const MESSAGE = {
  REQUIRED: "Vui lòng điền vào thông tin này!",
  SEND_SUCCESS:
    "CV của bạn đã được gửi đến cho chúng tôi, chúng tôi sẽ phản hồi lại ngay sau khi nhận được. Cám ơn bạn!",
  SEND_ERROR: "Đã có lỗi xảy ra!",
  EMAIL_FORMAT_ERROR: "Vui lòng nhập email đúng định dạng!",
  NAME_FORMAT_ERROR: "Vui lòng điền vào đầy đủ họ và tên!",
  PHONE_LENGTH_ERROR: "The length of phone number should be 10-12 characters!",
};
const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;

(function () {
  const fields = ["name", "phone", "position", "exp", "picture", "email"];
  const formInputDOM = {};
  const formErrorDOM = {};
  const errors = {};
  const touched = {};
  const infoForm = document.getElementById("infoForm");
  const notificationDOM = document.getElementById("notification");

  const render = {
    errorInput: (name) => {
      formErrorDOM[name].innerText = errors[name];

      if (errors[name]) formInputDOM[name].classList.add("f-control--error");
      else formInputDOM[name].classList.remove("f-control--error");
    },
    notification: (message, variant = "success") => {
      switch (variant) {
        case "success":
          notificationDOM.classList.remove("f-notification--error");
          notificationDOM.innerText = message;
          break;

        case "error":
          notificationDOM.classList.add("f-notification--error");
          notificationDOM.innerText = message;
          break;
      }
    },
  };

  const validateFns = {
    name: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      if (value.split(" ").filter((word) => !!word).length < 2)
        return MESSAGE.NAME_FORMAT_ERROR;
      return "";
    },
    phone: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      if (!(value.length >= 10 && value.length <= 12))
        return MESSAGE.PHONE_LENGTH_ERROR;

      return "";
    },
    position: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      return "";
    },
    exp: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      return "";
    },
    picture: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      return "";
    },
    email: (value) => {
      if (!value) return MESSAGE.REQUIRED;
      if (!emailRegex.test(value)) return MESSAGE.EMAIL_FORMAT_ERROR;
      return "";
    },
  };

  const validationField = (name, value) => {
    if (validateFns[name]) errors[name] = validateFns[name](value);
  };

  const triggerValidation = (name, value) => {
    const error = errors[name];
    validationField(name, value);
    if (error != errors[name]) render.errorInput(name);
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    if (touched[name]) triggerValidation(name, value);
  };

  const onBlur = (event) => {
    const { name, value } = event.target;

    triggerValidation(name, value);
    touched[name] = true;
  };

  const touchedAllField = () => {
    for (let key in touched) {
      touched[key] = true;
    }
  };

  const validationAllField = () => {
    for (let key in formInputDOM) {
      const { value, name } = formInputDOM[key];
      triggerValidation(name, value);
    }
  };

  const isAllFieldValid = () => {
    for (let key in errors) {
      if (errors[key]) return false;
    }
    return true;
  };

  const getValues = () => {
    const values = {};
    for (let field of fields) {
      if (field === "picture")
        values[field] = formInputDOM[field].files[0].name;
      else values[field] = formInputDOM[field].value;
    }
    return values;
  };

  const sendRequest = (values) => {
    fetch("https://freemind-test.netlify.app/.netlify/functions/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        render.notification(MESSAGE.SEND_SUCCESS, "success");
      })
      .catch((err) => {
        console.log(err);
        render.notification(MESSAGE.SEND_ERROR, "error");
      });
  };

  const submit = (e) => {
    e.preventDefault();

    touchedAllField();
    validationAllField();

    if (isAllFieldValid()) {
      const values = getValues();
      sendRequest(values);
    }
  };

  const initForm = () => {
    for (let field of fields) {
      formInputDOM[field] = document.getElementById(field);
      formErrorDOM[field] = document.getElementById(field + "-err");
      formInputDOM[field].addEventListener("input", onInputChange);
      formInputDOM[field].addEventListener("blur", onBlur);
      touched[field] = false;
      errors[field] = "";
    }

    infoForm.addEventListener("submit", submit);
  };
  initForm();
})();
