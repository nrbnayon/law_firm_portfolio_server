const generateOTP = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // 4 digit
  // return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // 6 digit
};

export default generateOTP;
