import { name as _name } from './c';

export const name = 'd';

export const showNameInC = () => {
  console.log(_name);
};

console.log('I am d.js', showNameInC());