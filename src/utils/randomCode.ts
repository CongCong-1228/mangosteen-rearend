/* eslint-disable prettier/prettier */
export const randomCodeFunc = () => {
  let randomCode = '';
  for (let i = 0; i < 6; i++) {
    const randomNumber = parseInt((Math.random() * 10).toString());
    randomCode += randomNumber;
  }
  return randomCode;
};
