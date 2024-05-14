export function RandomOTP() {
  let numbers = '';
  for (let i = 0; i < 6; i++) {
    numbers += Math.floor(Math.random() * 10);
  }
  return numbers;
}

export function checkExpried(date:Date) {

  let currentDate = new Date();

  if (date > currentDate) {
    return false; 
  } else {
    return true; 
  }
}

