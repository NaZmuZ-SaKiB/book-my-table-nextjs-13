import validator from "validator";

export default function validateReqBody({
  name,
  main_image,
  description,
  open_time,
  close_time,
  price,
  images,
}) {
  const validatorSchema = [
    {
      valid: validator.isLength(name, { min: 2, max: 40 }),
      errorMessage: "Name is too small!",
    },
    {
      valid: validator.isURL(main_image),
      errorMessage: "Main Image URL is invalid!",
    },
    {
      valid: validator.isLength(description, { min: 20 }),
      errorMessage: "Description is too small!",
    },
    {
      valid: validator.isISO8601(`2023-04-07T${open_time}`),
      errorMessage: "Open time is invalid!",
    },
    {
      valid: validator.isISO8601(`2023-04-07T${close_time}`),
      errorMessage: "Close time is invalid!",
    },
  ];

  const validationErrors = [];

  // Validate Images Array
  const isImages = () => {
    if (!Array.isArray(images)) return false;
    let check = true;

    images.forEach((image) => {
      if (!validator.isURL(image)) check = false;
    });

    return check;
  };

  if (!isImages()) {
    validationErrors.push("Invalid images. It must be an Array of image URLs!");
  }

  // Validate Price
  const isPrice = () => {
    const priceArray = ["REGULAR", "CHEAP", "EXPENSIVE"];
    if (!priceArray.includes(price)) return false;

    return true;
  };

  if (!isPrice()) {
    validationErrors.push("Invalid Price!");
  }

  validatorSchema.forEach((check) => {
    if (!check.valid) {
      validationErrors.push(check?.errorMessage);
    }
  });
  return validationErrors;
}
